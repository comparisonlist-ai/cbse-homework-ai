// ======================================================
// Students Homework AI
// script.js
// VERSION 4.0
// PART 1
// Configuration • Global State • Initialization
// ======================================================

// ------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------

const CONFIG = {

    API_URL: "/api/chat",

    GOOGLE_SCRIPT_URL:
        "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL",

    APP_NAME:
        "Students Homework AI",

    VERSION:
        "4.0",

    MAX_FREE_QUESTIONS:
        100,

    DEFAULT_LANGUAGE:
        "English"

};

// ------------------------------------------------------
// APPLICATION STATE
// ------------------------------------------------------

const App = {

    student: null,

    currentClass: "",

    currentSubject: "",

    language:
        localStorage.getItem("answerLanguage") ||
        CONFIG.DEFAULT_LANGUAGE,

    questionCount: 0,

    asking: false

};

// ------------------------------------------------------
// DOM CACHE
// ------------------------------------------------------

const Screens = {

    registration:
        document.getElementById("registration"),

    dashboard:
        document.getElementById("dashboard"),

    subject:
        document.getElementById("subjectScreen"),

    homework:
        document.getElementById("homeworkScreen"),

    question:
        document.getElementById("questionScreen"),

    loading:
        document.getElementById("loadingScreen"),

    answer:
        document.getElementById("answerScreen"),

    referral:
        document.getElementById("referralSection")

};

const UI = {

    message:
        document.getElementById("appMessage"),

    welcome:
        document.getElementById("welcomeMessage"),

    badge:
        document.getElementById("membershipBadge"),

    usageCounter:
        document.getElementById("usageCounter"),

    usageBar:
        document.getElementById("usageBar")

};

// ------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------

document.addEventListener(

    "DOMContentLoaded",

    initializeApp

);

function initializeApp() {

    console.log(

        CONFIG.APP_NAME +
        " Version " +
        CONFIG.VERSION

    );

    loadSession();

    initializeLanguage();

    if (App.student) {

        showDashboard();

    }

    else {

        showHome();

    }

}

// ------------------------------------------------------
// SCREEN MANAGEMENT
// ------------------------------------------------------

function hideAllScreens() {

    Object.values(Screens).forEach(screen => {

        if (screen) {

            screen.classList.add("hidden");

        }

    });

}

function showHome() {

    hideAllScreens();

    Screens.registration?.classList.remove(
        "hidden"
    );

}

function showDashboard() {

    hideAllScreens();

    Screens.dashboard?.classList.remove(
        "hidden"
    );

    updateDashboard();

}

function openScreen(screen) {

    hideAllScreens();

    screen?.classList.remove("hidden");

}

// ------------------------------------------------------
// LANGUAGE
// ------------------------------------------------------

function initializeLanguage() {

    document

        .querySelectorAll(".language-btn")

        .forEach(button => {

            button.addEventListener(

                "click",

                function () {

                    if (

                        this.innerText.includes("English")

                    ) {

                        App.language =
                            "English";

                    }

                    else {

                        App.language =
                            "Hindi";

                    }

                    localStorage.setItem(

                        "answerLanguage",

                        App.language

                    );

                    refreshLanguageButtons();

                }

            );

        });

    refreshLanguageButtons();

}

function refreshLanguageButtons() {

    document

        .querySelectorAll(".language-btn")

        .forEach(button => {

            button.classList.remove("active");

            if (

                App.language === "English" &&
                button.innerText.includes("English")

            ) {

                button.classList.add("active");

            }

            if (

                App.language === "Hindi" &&
                button.innerText.includes("हिन्दी")

            ) {

                button.classList.add("active");

            }

        });

}

// ------------------------------------------------------
// REGISTRATION FORM
// ------------------------------------------------------

function showRegistrationForm() {

    document

        .getElementById("registrationForm")

        ?.classList.remove("hidden");

}

async function registerStudent() {

    const name =
        document.getElementById("name")
        ?.value.trim();

    const mobile =
        document.getElementById("mobile")
        ?.value.trim();

    const email =
        document.getElementById("email")
        ?.value.trim();

    if (!name) {

        return showMessage(
            "Please enter student name."
        );

    }

    if (!/^[0-9]{10}$/.test(mobile)) {

        return showMessage(
            "Enter a valid mobile number."
        );

    }

    if (!email) {

        return showMessage(
            "Please enter email address."
        );

    }

    App.student = {

        name,

        mobile,

        email,

        language:
            App.language,

        joined:
            new Date().toISOString(),

        membership:
            "FREE",

        trial:
            true

    };

    saveSession();

    sendRegistrationToGoogleSheet();

    showMessage(

        "Registration Successful."

    );

    showDashboard();

}

// ------------------------------------------------------
// GOOGLE SHEETS
// ------------------------------------------------------

async function sendRegistrationToGoogleSheet() {

    if (

        CONFIG.GOOGLE_SCRIPT_URL ===
        "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL"

    ) {

        return;

    }

    try {

        await fetch(

            CONFIG.GOOGLE_SCRIPT_URL,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(

                    App.student

                )

            }

        );

    }

    catch (error) {

        console.log(

            "Google Sheet Error",

            error

        );

    }

}

// ======================================================
// END OF VERSION 4.0
// PART 1
// ======================================================
