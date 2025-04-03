
const apiUrl = "http://localhost:3000/products"; 
const cartUrl = "http://localhost:3000/cart"; 

const brandContainer = document.getElementById("brandContainer");
const watchContainer = document.getElementById("watchList");


const fetchWatches = () => {
    fetch(apiUrl)
        .then(res => res.json())
        .then(products => {
            displayBrands(products);
            displayWatches(products);
        })
        .catch(error => console.error("Error fetching watches:", error));
};


const displayBrands = (products) => {
    const brands = ["All", ...new Set(products.map(p => p.brand))]; 

    brandContainer.innerHTML = brands.map(brand => `
        <button onclick="filterByBrand('${brand}')">${brand}</button>
    `).join("");
};


const displayWatches = (products) => {
    watchContainer.innerHTML = "";
    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("watch-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="watch-image">
            <h3>${product.name}</h3>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Price:</strong> ₹${product.price}</p>
            <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">Add to Cart 🛒</button>
        `;

        watchContainer.appendChild(card);
    });
};


const filterByBrand = (brand) => {
    fetch(apiUrl)
        .then(res => res.json())
        .then(products => {
            if (brand === "All") {
                displayWatches(products); 
            } else {
                const filteredProducts = products.filter(p => p.brand === brand);
                displayWatches(filteredProducts);
            }
        })
        .catch(error => console.error("Error filtering watches:", error));
};


const addToCart = (id, name, price, image) => {
    fetch(cartUrl)
        .then(res => res.json())
        .then(cart => {
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                return fetch(`${cartUrl}/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: (existingItem.quantity || 1) + 1 })
                });
            } else {
                const product = { id, name, price, image, quantity: 1 };

                return fetch(cartUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(product)
                });
            }
        })
        .then(res => {
            if (res.ok) {
                alert(`${name} added to cart!`);
            }
        })
        .catch(error => console.error("Error adding to cart:", error));
};


fetchWatches();
