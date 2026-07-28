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

// ======================================================
// Students Homework AI
// VERSION 5.0
// PART 2
// Registration • Login • Dashboard • Class Navigation
// ======================================================

// ------------------------------------------------------
// REGISTRATION
// ------------------------------------------------------

async function registerStudent() {

    const name =
        document.getElementById("studentName")
        ?.value.trim();

    const studentClass =
        document.getElementById("studentClass")
        ?.value;

    const mobile =
        document.getElementById("studentMobile")
        ?.value.trim();

    const parentMobile =
        document.getElementById("parentMobile")
        ?.value.trim();

    const email =
        document.getElementById("studentEmail")
        ?.value.trim();

    if (!name) {

        showMessage("Please enter Student Name.");

        return;

    }

    if (!studentClass) {

        showMessage("Please select Class.");

        return;

    }

    if (!/^[0-9]{10}$/.test(mobile)) {

        showMessage("Please enter a valid Mobile Number.");

        return;

    }

    if (!email) {

        showMessage("Please enter Email Address.");

        return;

    }

    const studentId =
        generateStudentId();

    App.student = {

        studentId,

        name,

        studentClass,

        mobile,

        parentMobile,

        email,

        membership:
            "FREE",

        trial:
            true,

        joined:
            new Date().toISOString()

    };

    App.currentClass =
        studentClass;

    App.questionCount = 0;

    saveSession();

    await sendRegistrationToGoogleSheet();

    alert(

        "🎉 Registration Successful\n\n" +

        "Student ID : " +

        studentId +

        "\n\nPlease save your Student ID."

    );

    showDashboard();

}

// ------------------------------------------------------
// LOGIN
// ------------------------------------------------------

function loginStudent() {

    const id =
        document.getElementById("loginStudentId")
        ?.value.trim();

    const mobile =
        document.getElementById("loginMobile")
        ?.value.trim();

    if (!App.student) {

        showMessage(

            "No registered student found on this device."

        );

        return;

    }

    if (

        id !== App.student.studentId ||

        mobile !== App.student.mobile

    ) {

        showMessage(

            "Invalid Student ID or Mobile Number."

        );

        return;

    }

    App.currentClass =
        App.student.studentClass;

    showDashboard();

}

// ------------------------------------------------------
// DASHBOARD
// ------------------------------------------------------

function updateDashboard() {

    const welcome =
        document.getElementById(
            "welcomeMessage"
        );

    if (welcome && App.student) {

        welcome.innerHTML =

            "<strong>" +

            App.student.name +

            "</strong><br>" +

            "Student ID : " +

            App.student.studentId +

            "<br>" +

            "Class : " +

            App.student.studentClass;

    }

    const badge =
        document.getElementById(
            "membershipBadge"
        );

    if (badge) {

        badge.innerHTML =

            "🆓 7-Day FREE Trial";

    }

    updateUsage();

}

// ------------------------------------------------------
// USAGE
// ------------------------------------------------------

function updateUsage() {

    const counter =
        document.getElementById(
            "usageCounter"
        );

    if (counter) {

        counter.innerHTML =

            "Questions Used : <strong>" +

            App.questionCount +

            " / " +

            CONFIG.MAX_FREE_QUESTIONS +

            "</strong>";

    }

    const bar =
        document.getElementById(
            "usageBar"
        );

    if (bar) {

        const percent =

            Math.min(

                (App.questionCount /

                CONFIG.MAX_FREE_QUESTIONS)

                * 100,

                100

            );

        bar.style.width =

            percent + "%";

    }

}

// ------------------------------------------------------
// CLASS
// ------------------------------------------------------

function selectClass(className) {

    App.currentClass =
        className;

    document.getElementById(
        "selectedClassTitle"
    ).textContent =

        "Class " +

        className;

    showSubjectScreen();

}

// ------------------------------------------------------
// SUBJECT
// ------------------------------------------------------

function openHomework(subject) {

    App.currentSubject =
        subject;

    document.getElementById(
        "selectedSubjectTitle"
    ).textContent =

        "Class " +

        App.currentClass +

        " • " +

        subject;

    showHomeworkScreen();

}

// ------------------------------------------------------
// BACK
// ------------------------------------------------------

function goBackToSubjects() {

    showSubjectScreen();

}

function goBackToHomework() {

    showHomeworkScreen();

}

function askAnotherQuestion() {

    showQuestionScreen();

}

// ------------------------------------------------------
// LOGOUT
// ------------------------------------------------------

function logoutStudent() {

    if (

        !confirm("Logout?")

    ) {

        return;

    }

    localStorage.removeItem(
        "cbseStudent"
    );

    localStorage.removeItem(
        "questionCount"
    );

    App.student = null;

    App.questionCount = 0;

    showHome();

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

        console.log(error);

    }

}

// ======================================================
// END OF VERSION 5.0
// PART 2
// ======================================================
