// ===============================
// CBSE Homework AI - script.js
// ===============================

// REPLACE WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const API_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Check if student is already registered
window.onload = function () {
    const registered = localStorage.getItem("registered");

    if (registered === "true") {
        showDashboard();
    }
};

// Register Student
async function registerStudent() {

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !mobile || !email) {
        alert("Please fill all fields.");
        return;
    }

    try {

        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                mobile,
                email,
                date: new Date().toLocaleString()
            })
        });

        localStorage.setItem("registered", "true");
        localStorage.setItem("studentName", name);
        localStorage.setItem("trialStart", Date.now());
        localStorage.setItem("questionCount", "0");

        document.getElementById("success").style.display = "block";

        setTimeout(showDashboard, 1500);

    } catch (err) {
        alert("Registration failed.");
        console.error(err);
    }

}

// Show Dashboard
function showDashboard() {

    document.getElementById("registration").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

}

// Logout
function logout() {

    localStorage.clear();
    location.reload();

}

// Class Buttons
document.addEventListener("DOMContentLoaded", () => {

    ["6", "7", "8", "9", "10"].forEach(cls => {

        const btn = document.getElementById("class" + cls);

        if (!btn) return;

        btn.addEventListener("click", () => {

            alert("Open Class " + cls + " Dashboard");

            // Replace with your existing function
            // showClassDashboard("Class " + cls);

        });

    });

});

// ===============================
// CBSE Homework AI - script.js
// ===============================

// Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

// -------------------------------
// Auto Login
// -------------------------------
window.onload = function () {
    if (localStorage.getItem("registered") === "true") {
        showDashboard();
    }
};

// -------------------------------
// Register Student
// -------------------------------
async function registerStudent() {

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !mobile || !email) {
        alert("Please fill all fields.");
        return;
    }

    if (mobile.length !== 10) {
        alert("Enter a valid mobile number.");
        return;
    }

    const btn = document.querySelector("#registration button");
    btn.disabled = true;
    btn.innerText = "Registering...";

    try {

        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                mobile,
                email,
                time: new Date().toLocaleString()
            })
        });

        localStorage.setItem("registered", "true");
        localStorage.setItem("studentName", name);
        localStorage.setItem("studentMobile", mobile);
        localStorage.setItem("studentEmail", email);

        document.getElementById("success").style.display = "block";

        setTimeout(showDashboard, 1200);

    } catch (err) {

        alert("Registration failed.");

        btn.disabled = false;
        btn.innerText = "Start Free Trial";
    }
}

// -------------------------------
// Dashboard
// -------------------------------
function showDashboard() {

    document.getElementById("registration").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
}

// -------------------------------
// Logout
// -------------------------------
function logout() {

    localStorage.removeItem("registered");
    location.reload();
}

// -------------------------------
// Class Buttons
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {

    ["6","7","8","9","10"].forEach(cls => {

        const btn = document.getElementById("class" + cls);

        if (!btn) return;

        btn.onclick = () => {

            alert("Open Class " + cls + " Dashboard");

            // Replace this with your existing function
            // showClassDashboard("Class " + cls);

        };

    });

});
