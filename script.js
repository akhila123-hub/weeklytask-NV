const API_URL = "https://67cb2cc03395520e6af495a9.mockapi.io/expenses"; 

const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");

let expenses = [];


async function fetchExpenses() {
    try {
        const response = await fetch(API_URL);
        expenses = await response.json();
        renderExpenses();
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
}


expenseForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const newExpense = { description, amount };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExpense)
        });
        const savedExpense = await response.json();
        expenses.push(savedExpense);
        renderExpenses();
    } catch (error) {
        console.error("Error saving expense:", error);
    }

    expenseForm.reset();
});


async function deleteExpense(expenseId) {
    try {
        await fetch(`${API_URL}/${expenseId}`, { method: "DELETE" });
        expenses = expenses.filter(exp => exp.id !== expenseId);
        renderExpenses();
    } catch (error) {
        console.error("Error deleting expense:", error);
    }
}


function renderExpenses() {
    expenseList.innerHTML = "";
    let total = 0;

    expenses.forEach(expense => {
        total = total + parseFloat(expense.amount);


        const li = document.createElement("li");
        li.innerHTML = `${expense.description} - ₹${expense.amount.toFixed(2)} 
            <button class="delete-btn" data-id="${expense.id}">❌</button>`;
        li.classList.add("expense-item");
        expenseList.appendChild(li);
    });

    totalAmount.textContent = `Total: ₹${total.toFixed(2)}`;
}


expenseList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        const expenseId = e.target.getAttribute("data-id");
        deleteExpense(expenseId);
    }
});


fetchExpenses();
