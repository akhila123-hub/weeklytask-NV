const apiUrl = "http://localhost:3000";
const userId = localStorage.getItem("loggedInUserId");


const placeOrder = async () => {
    if (!userId) {
        alert("You need to log in to place an order.");
        return;
    }

    
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    
   

    
    const newOrder = {
        userId,
        items: cart,
    
        status: "Pending",
        date: new Date().toISOString()
    };

    try {
        await fetch(`${apiUrl}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrder)
        });

        alert("Order placed successfully!");

        
        localStorage.removeItem("cart");

        
        window.location.href = "order-history.html";
    } catch (error) {
        console.error("Error placing order:", error);
    }
};


const fetchOrders = async () => {
    if (!userId) {
        window.location.href = "index.html"; 
        return;
    }

    try {
        const res = await fetch(`${apiUrl}/orders?userId=${userId}`);
        const orders = await res.json();

        const orderContainer = document.getElementById("orderList");
        orderContainer.innerHTML = "";

        if (orders.length === 0) {
            orderContainer.innerHTML = "<p>No orders found.</p>";
            return;
        }

        orders.forEach(order => {
            const orderDiv = document.createElement("div");
            orderDiv.classList.add("order-card");

            orderDiv.innerHTML = `
                <h3>Order #${order.id}</h3>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                
                <h4>Items:</h4>
                <ul>
                    ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</li>`).join("")}
                </ul>
            `;

            orderContainer.appendChild(orderDiv);
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

const placeOrderBtn = document.getElementById("placeOrderBtn");
if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", placeOrder);
}


document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("orderList")) {
        fetchOrders();
    }
});
document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (!loggedInUserId) {
       
        window.location.href = "index.html";
    }
});
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUserId"); 
    alert("Logged out successfully!");
    window.location.href = "index.html"; 
});