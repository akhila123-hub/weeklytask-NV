document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const toggleSignup = document.getElementById("toggleSignup");
    const toggleLogin = document.getElementById("toggleLogin");
    const loginWrapper = document.querySelector(".login");
    const signupWrapper = document.querySelector(".signup");

    const API_URL = "http://localhost:3000/users"; 

    // Toggle between Login and Signup forms
    document.getElementById("toggleSignup").addEventListener("click", () => {
        document.querySelector(".login").style.display = "none";
        document.querySelector(".signup").style.display = "block";
    });
    
    document.getElementById("toggleLogin").addEventListener("click", () => {
        document.querySelector(".signup").style.display = "none";
        document.querySelector(".login").style.display = "block";
    });
    function saveUserToLocal(user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("loggedInUserId", user.id);
    }
    
    function getLoggedInUserId() {
        return localStorage.getItem("loggedInUserId");
    }

    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Password validation (Min 6 chars, 1 uppercase, 1 number, 1 special character)
    function isValidPassword(password) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
    }

    // Signup functionality
    document.getElementById("signupForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validation checks
        if (!fullName || !username || !email || !phone || !password || !confirmPassword) {
            alert("Error: All fields are required!");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Error: Invalid email format!");
            return;
        }

        if (!isValidPassword(password)) {
            alert("Error: Password must have 6+ characters, 1 uppercase, 1 number, and 1 special character!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Error: Passwords do not match!");
            return;
        }

        try {
            let response = await fetch(API_URL);
            let users = await response.json();

            // Check if username or email already exists
            let userExists = users.find(user => user.email === email || user.username === username);

            if (userExists) {
                alert("Error: Email or Username already exists!");
                return;
            }
            const newUserId = String(users.length + 1);

            // Create user object
            const newUser = {
                id: newUserId,
                fullName,
                username,
                email,
                phone,
                password,
                role: "user",
                cart: []
            };
            // Save new user
            const saveResponse = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
    console.log(saveResponse)
            if (!saveResponse.ok) {
                throw new Error("Failed to save user");
            }
    
            alert("Account created successfully! You can now log in.");
            document.getElementById("signupForm").reset();
            document.querySelector(".signup").style.display = "none";
            document.querySelector(".login").style.display = "block";
        } catch (error) {
            console.error("Signup error:", error);
            alert("Error signing up. Please try again.");
        }
    });
    document.getElementById("loginForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const loginUser = document.getElementById("loginUser").value.trim();
        const loginPassword = document.getElementById("loginPassword").value;
        const role = document.querySelector('input[name="role"]:checked').value;
    
        const res = await fetch(API_URL);
        const users = await res.json();
        const user = users.find(u => (u.email === loginUser || u.username === loginUser) && u.password === loginPassword);
    
        if (user) {
            localStorage.setItem("loggedInUserId", user.id);
        localStorage.setItem("userRole", user.role); 
            saveUserToLocal(user);
            if (user.role === "admin") {
                window.location.href = "admin.html"; // Redirect to admin panel
            } else {
                window.location.href = "dashboard.html"; // Redirect to user cart page
            }
        } else {
            alert("Invalid credentials!");
        }
    });
    
    document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInUserId");
        window.location.href = "Index.html"; // Redirect to login
    });
    
    });
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
    


