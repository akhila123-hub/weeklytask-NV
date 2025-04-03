document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const toggleSignup = document.getElementById("toggleSignup");
    const toggleLogin = document.getElementById("toggleLogin");
    const loginWrapper = document.querySelector(".login");
    const signupWrapper = document.querySelector(".signup");

    const API_URL = "http://localhost:3000/users"; 

    // Toggle between Login and Signup forms
    toggleSignup.addEventListener("click", function () {
        loginWrapper.style.display = "none";
        signupWrapper.style.display = "block";
    });

    toggleLogin.addEventListener("click", function () {
        signupWrapper.style.display = "none";
        loginWrapper.style.display = "block";
    });

    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Password validation (Min 6 chars, 1 uppercase, 1 number, 1 special character)
    function isValidPassword(password) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
    }

    // Signup functionality
    signupForm.addEventListener("submit", async function (e) {
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

            // Save new user
            let newUser = { fullName, username, email, phone, password, role: "user" };
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            alert("Success! Account created.");
            signupForm.reset();
            signupWrapper.style.display = "none";
            loginWrapper.style.display = "block";
        } catch (error) {
            console.error("Error:", error);
            alert("Server error. Please try again.");
        }
    });

    // Login functionality
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const loginUser = document.getElementById("loginUser").value.trim();
        const loginPassword = document.getElementById("loginPassword").value;
        const selectedRole = document.querySelector("input[name='role']:checked").value;

        if (!loginUser || !loginPassword) {
            alert("Error: All fields are required!");
            return;
        }

        try {
            let response = await fetch(API_URL);
            let users = await response.json();

            // Admin login
            if (loginUser === "admin" && loginPassword === "admin" && selectedRole === "admin") {
                localStorage.setItem("loggedInUser", JSON.stringify({ username: "admin", role: "admin" }));
                alert("Admin Login Successful!");
                window.location.href = "admin.html";
                return;
            }

            // Check user credentials
            let user = users.find(user => (user.email === loginUser || user.username === loginUser) && user.password === loginPassword);

            if (!user) {
                alert("Error: Invalid Username or Password!");
                return;
            }

            // Role-based login
            if (user.role === "user" && selectedRole === "user") {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
                localStorage.setItem("loggedInUserId", user.id); // Store user ID
                alert("User Login Successful!");

                // Redirect to Dashboard
                window.location.href = "dashboard.html";
            } else {
                alert("Error: Only admins can log in with the Admin role.");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Server error. Please try again.");
        }
    });

});
