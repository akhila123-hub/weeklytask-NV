
const apiUrl = "http://localhost:3000/products"; 
const cartUrl = "http://localhost:3000/users"; 

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

const getLoggedInUserId = () => localStorage.getItem("loggedInUserId");

const addToCart = async (id, name, price, image) => {
    const userId = getLoggedInUserId();
    if (!userId) {
        alert("Please log in to add items to your cart.");
        return;
    }

    try {
        // Fetch the user's data
        const res = await fetch(`${cartUrl}/${userId}`);
        if (!res.ok) throw new Error("User not found");

        const userData = await res.json();
        let cart = userData.cart || []; // Get existing cart or empty array

        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity
        } else {
            cart.push({ id, name, price, image, quantity: 1 }); // Add new item
        }

        // Update user's cart in the database
        await fetch(`${cartUrl}/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart })
        });

        alert(`${name} added to cart!`);
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};
document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    const currentPage = window.location.pathname.split("/").pop(); // Get the current filename

    if (!loggedInUserId && currentPage !== "index.html") {
        // If not logged in & not on the login page, redirect to login
        window.location.href = "index.html";
    } else if (loggedInUserId && currentPage === "index.html") {
        // If logged in & trying to access login, go to dashboard
        window.location.href = "dashboard.html";
    }
});


fetchWatches();
