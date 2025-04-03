const apiUrl = "http://localhost:3000/products";


const fetchProducts = async () => {
    try {
        const res = await fetch(apiUrl);  
        const products = await res.json(); 
        const container = document.getElementById("productList");
        container.innerHTML = ""; 

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.dataset.id = product.id;

            card.innerHTML = `
                <h3 class="product-brand">${product.brand}</h3>
                <img src="${product.image}" alt="${product.name}">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">₹${product.price}</p>
                <p class="product-category"><strong>Category:</strong> ${product.category}</p>
                <button class="modify-btn" data-id="${product.id}">Modify</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};


document.getElementById("productList").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        deleteProduct(event.target.dataset.id);
    }
    if (event.target.classList.contains("modify-btn")) {
        enterEditMode(event.target.dataset.id);
    }
});


document.getElementById("addProduct").addEventListener("click", async () => {
    const brand = document.getElementById("brand").value;
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value;

    if (!brand || !name || !price || !image || !category) {
        alert("Please enter all fields!");
        return;
    }

    const newProduct = { brand, name, price, image, category };

    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        });
        alert("Product added successfully!");
        fetchProducts();
    } catch (error) {
        console.error("Error adding product:", error);
    }
});


const enterEditMode = (id) => {
    const card = document.querySelector(`.product-card[data-id='${id}']`);
    const brand = card.querySelector(".product-brand").textContent;
    const name = card.querySelector(".product-name").textContent;
    const price = card.querySelector(".product-price").textContent.replace("₹", "");
    const category = card.querySelector(".product-category").textContent.replace("Category: ", "");

    card.innerHTML = `
        <input type="text" class="edit-brand" value="${brand}">
        <input type="text" class="edit-name" value="${name}">
        <input type="number" class="edit-price" value="${price}">
        <input type="text" class="edit-image" placeholder="Enter image URL">
        <select class="edit-category">
            <option value="mens" ${category === "mens" ? "selected" : ""}>Men's Watches</option>
            <option value="female" ${category === "female" ? "selected" : ""}>Female Watches</option>
        </select>
        <button class="save-btn" data-id="${id}">Save</button>
        <button class="cancel-btn" data-id="${id}">Cancel</button>
    `;
};


document.getElementById("productList").addEventListener("click", (event) => {
    if (event.target.classList.contains("save-btn")) {
        saveProduct(event.target.dataset.id);
    }
    if (event.target.classList.contains("cancel-btn")) {
        fetchProducts(); 
    }
});


const saveProduct = async (id) => {
    const card = document.querySelector(`.product-card[data-id='${id}']`);
    const newBrand = card.querySelector(".edit-brand").value;
    const newName = card.querySelector(".edit-name").value;
    const newPrice = card.querySelector(".edit-price").value;
    const newImage = card.querySelector(".edit-image").value;
    const newCategory = card.querySelector(".edit-category").value;

    if (!newBrand || !newName || !newPrice || !newCategory) {
        alert("Brand, Name, Price, and Category are required!");
        return;
    }

    const updatedProduct = { brand: newBrand, name: newName, price: newPrice, category: newCategory };
    if (newImage) updatedProduct.image = newImage;

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        });
        alert("Product updated successfully!");
        fetchProducts();
    } catch (error) {
        console.error("Error updating product:", error);
    }
};


const deleteProduct = async (id) => {
    try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        alert("Product deleted successfully!");
        fetchProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};


document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUserId"); 
    alert("Logged out successfully!");
    window.location.href = "index.html"; 
});


fetchProducts();
