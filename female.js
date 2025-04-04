const apiUrl = "http://localhost:3000/products";
const container = document.getElementById("productList");


const fetchFemaleProducts = () => {
    fetch(apiUrl)
        .then(res => res.json())
        .then(products => {
            container.innerHTML = "";

            
            const femaleProducts = products.filter(product => product.category === "female");

            if (femaleProducts.length === 0) {
                container.innerHTML = "<p>No female watches available.</p>";
                return;
            }

            femaleProducts.forEach(product => {
                const card = document.createElement("div");
                card.classList.add("product-card");

                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>₹${product.price}</p>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error fetching female watches:", error));
};


const addToCart = (id, name, price, image) => {
    const cartUrl = "http://localhost:3000/cart";

    const cartItem = { id, name, price, image };

    fetch(cartUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem)
    })
    .then(() => alert(`${name} added to cart!`))
    .catch(error => console.error("Error adding to cart:", error));
};


fetchFemaleProducts();
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


