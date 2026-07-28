// ======================================================
// Students Homework AI
// script.js
// VERSION 5.0
// PART 1
// Configuration • State • Initialization • Navigation
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
        "5.0",

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

    questionCount:
        parseInt(
            localStorage.getItem("questionCount")
        ) || 0,

    asking: false

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

    showHome();

}

// ------------------------------------------------------
// SCREEN MANAGEMENT
// ------------------------------------------------------

function hideAllScreens() {

    document

        .querySelectorAll(".screen")

        .forEach(screen => {

            screen.classList.add("hidden");

        });

}

function showHome() {

    hideAllScreens();

    document

        .getElementById("homeScreen")

        ?.classList.remove("hidden");

}

function showRegistrationForm() {

    hideAllScreens();

    document

        .getElementById("registrationScreen")

        ?.classList.remove("hidden");

}

function showLoginScreen() {

    hideAllScreens();

    document

        .getElementById("loginScreen")

        ?.classList.remove("hidden");

}

function showDashboard() {

    hideAllScreens();

    document

        .getElementById("dashboard")

        ?.classList.remove("hidden");

    updateDashboard();

}

function showSubjectScreen() {

    hideAllScreens();

    document

        .getElementById("subjectScreen")

        ?.classList.remove("hidden");

}

function showHomeworkScreen() {

    hideAllScreens();

    document

        .getElementById("homeworkScreen")

        ?.classList.remove("hidden");

}

function showQuestionScreen() {

    hideAllScreens();

    document

        .getElementById("questionScreen")

        ?.classList.remove("hidden");

}

function showLoadingScreen() {

    hideAllScreens();

    document

        .getElementById("loadingScreen")

        ?.classList.remove("hidden");

}

function showAnswerScreen() {

    hideAllScreens();

    document

        .getElementById("answerScreen")

        ?.classList.remove("hidden");

}

function goHome() {

    showHome();

}

// ------------------------------------------------------
// SESSION
// ------------------------------------------------------

function saveSession() {

    if (!App.student) return;

    localStorage.setItem(

        "cbseStudent",

        JSON.stringify(App.student)

    );

    localStorage.setItem(

        "questionCount",

        App.questionCount

    );

}

function loadSession() {

    try {

        const saved =

            localStorage.getItem(
                "cbseStudent"
            );

        if (saved) {

            App.student =
                JSON.parse(saved);

        }

    }

    catch {

        App.student = null;

    }

}

// ------------------------------------------------------
// MESSAGE
// ------------------------------------------------------

function showMessage(message) {

    const box =

        document.getElementById(
            "appMessage"
        );

    if (!box) {

        alert(message);

        return;

    }

    box.textContent = message;

    box.classList.remove("hidden");

    clearTimeout(showMessage.timer);

    showMessage.timer = setTimeout(() => {

        box.classList.add("hidden");

    }, 3000);

}

// ------------------------------------------------------
// STUDENT ID
// ------------------------------------------------------

function generateStudentId() {

    return "SHAI" +

        Math.floor(

            100000 +

            Math.random() * 900000

        );

}

// ======================================================
// END OF VERSION 5.0
// PART 1
// ======================================================
