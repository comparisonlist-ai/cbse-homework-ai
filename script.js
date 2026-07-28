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
        showMessage("Please select your Class.");
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        showMessage("Enter a valid 10-digit Mobile Number.");
        return;
    }

    if (!email) {
        showMessage("Please enter Email Address.");
        return;
    }

    // Generate Student ID
    const studentId =
        "SHAI" +
        Date.now().toString().slice(-6);

    App.student = {

        studentId: studentId,

        name: name,

        studentClass: studentClass,

        mobile: mobile,

        parentMobile: parentMobile,

        email: email,

        language: App.language,

        membership: "FREE",

        joined: new Date().toISOString(),

        trial: true

    };

    App.questionCount = 0;

    saveSession();

    await sendRegistrationToGoogleSheet();

    alert(
        "🎉 Registration Successful!\n\n" +
        "Student ID: " + studentId +
        "\n\nPlease save this Student ID.\nYou will use it for future login."
    );

    document.getElementById("registrationScreen")
        ?.classList.add("hidden");

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
// ======================================================
// Students Homework AI
// Version 4.0
// PART 2
// Dashboard • Navigation • Class • Subject
// ======================================================

// ------------------------------------------------------
// DASHBOARD
// ------------------------------------------------------

function updateDashboard() {

    if (!App.student) return;

    if (UI.welcome) {

        UI.welcome.innerHTML =
    "Welcome, <strong>" +
    App.student.name +
    "</strong><br>" +
    "Student ID: <strong>" +
    App.student.studentId +
    "</strong>";

    }

    if (UI.badge) {

        UI.badge.textContent =
            App.student.trial
            ? "🆓 7-Day FREE Trial"
            : "⭐ Premium Member";

    }

    updateUsage();

}

// ------------------------------------------------------
// USAGE
// ------------------------------------------------------

function updateUsage() {

    if (UI.usageCounter) {

        UI.usageCounter.innerHTML =
            `Questions Used:
            <strong>${App.questionCount}
            / ${CONFIG.MAX_FREE_QUESTIONS}</strong>`;

    }

    if (UI.usageBar) {

        const percent = Math.min(

            (App.questionCount /
            CONFIG.MAX_FREE_QUESTIONS) * 100,

            100

        );

        UI.usageBar.style.width =
            percent + "%";

    }

}

// ------------------------------------------------------
// CLASS
// ------------------------------------------------------

function selectClass(className) {

    App.currentClass = className;

    openScreen(Screens.subject);

    const title =
        document.getElementById(
            "selectedClassTitle"
        );

    if (title) {

        title.textContent =
            className;

    }

}

// ------------------------------------------------------
// SUBJECT
// ------------------------------------------------------

function openHomework(subject) {

    App.currentSubject = subject;

    openScreen(Screens.homework);

    const title =
        document.getElementById(
            "selectedSubjectTitle"
        );

    if (title) {

        title.textContent =
            App.currentClass +
            " • " +
            subject;

    }

}

// ------------------------------------------------------
// QUESTION SCREEN
// ------------------------------------------------------

function showQuestionScreen() {

    openScreen(Screens.question);

    const title =
        document.getElementById(
            "questionScreenTitle"
        );

    if (title) {

        title.textContent =

            App.currentClass +
            " • " +
            App.currentSubject;

    }

    const box =
        document.getElementById(
            "questionInput"
        );

    if (box) {

        box.value = "";

        box.focus();

    }

}

// ------------------------------------------------------
// NAVIGATION
// ------------------------------------------------------

function goBackToDashboard() {

    showDashboard();

}

function goBackToSubjects() {

    openScreen(Screens.subject);

}

function goBackToHomework() {

    openScreen(Screens.homework);

}

function askAnotherQuestion() {

    showQuestionScreen();

}

// ------------------------------------------------------
// QUESTION
// ------------------------------------------------------

function clearQuestion() {

    const box =
        document.getElementById(
            "questionInput"
        );

    if (!box) return;

    box.value = "";

    box.focus();

}

// ------------------------------------------------------
// FEATURE PLACEHOLDERS
// ------------------------------------------------------

function startOCR() {

    showMessage(

        "Homework Scan will be available soon."

    );

}

function startVoiceInput() {

    showMessage(

        "Voice Questions will be available soon."

    );

}

function openNCERTSolutions() {

    showMessage(

        "NCERT Solutions module is coming soon."

    );

}

// ------------------------------------------------------
// LEARN MORE
// ------------------------------------------------------

function learnMore() {

    askAI(true);

}

// ------------------------------------------------------
// LOGOUT
// ------------------------------------------------------

function logoutStudent() {

    if (!confirm("Logout now?")) return;

    localStorage.removeItem("cbseStudent");

    App.student = null;

    App.currentClass = "";

    App.currentSubject = "";

    App.questionCount = 0;

    showHome();

    showMessage("Logged out successfully.");

}

// ======================================================
// END OF VERSION 4.0
// PART 2
// ======================================================

// ======================================================
// Students Homework AI
// Version 4.0
// PART 3
// AI Engine • Quick Answer • Learn More
// ======================================================

// ------------------------------------------------------
// ASK AI
// mode:
// "quick" = Short NCERT answer
// "learn" = Detailed explanation
// ------------------------------------------------------

async function askAI(mode = "quick") {

    if (App.asking) {

        showMessage("Please wait...");

        return;

    }

    const questionBox =
        document.getElementById("questionInput");

    if (!questionBox) return;

    const question =
        questionBox.value.trim();

    if (question === "") {

        showMessage(
            "Please enter your question."
        );

        questionBox.focus();

        return;

    }

    App.asking = true;

    openScreen(Screens.loading);

    try {

        const response =
            await fetch(CONFIG.API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                    className:
                        App.currentClass,

                    subject:
                        App.currentSubject,

                    language:
                        App.language,

                    question:
                        question,

                    mode:
                        mode

                })

            });

        if (!response.ok) {

            throw new Error(
                "Server Error"
            );

        }

        const data =
            await response.json();

        displayAnswer(

            data.answer ||
            data.text ||
            "No answer received."

        );

        if (mode === "quick") {

            App.questionCount++;

            updateUsage();

        }

    }

    catch (error) {

        console.error(error);

        displayAnswer(

            "Unable to get an answer. Please try again."

        );

    }

    finally {

        App.asking = false;

    }

}

// ------------------------------------------------------
// DISPLAY ANSWER
// ------------------------------------------------------

function displayAnswer(answer) {

    openScreen(Screens.answer);

    const container =
        document.getElementById(
            "answerContainer"
        );

    if (!container) return;

    container.innerHTML =
        formatAnswer(answer);

    addLearnMoreButton();

}

// ------------------------------------------------------
// LEARN MORE BUTTON
// ------------------------------------------------------

function addLearnMoreButton() {

    if (

        document.getElementById(
            "learnMoreButton"
        )

    ) {

        return;

    }

    const container =
        document.getElementById(
            "answerContainer"
        );

    const button =
        document.createElement("button");

    button.id =
        "learnMoreButton";

    button.className =
        "secondary-btn mt-20";

    button.innerHTML =
        "📖 Learn More";

    button.onclick =
        loadDetailedAnswer;

    container.appendChild(button);

}

// ------------------------------------------------------
// LOAD DETAILED ANSWER
// ------------------------------------------------------

function loadDetailedAnswer() {

    document
        .getElementById(
            "learnMoreButton"
        )
        ?.remove();

    askAI("learn");

}

// ------------------------------------------------------
// FORMAT ANSWER
// ------------------------------------------------------

function formatAnswer(text) {

    if (!text) return "";

    return text

        .replace(/\r\n/g,"\n")

        .replace(/\n\n/g,"<br><br>")

        .replace(/\n/g,"<br>")

        .replace(/\*\*(.*?)\*\*/g,
            "<strong>$1</strong>")

        .replace(/### (.*?)<br>/g,
            "<h3>$1</h3>")

        .replace(/## (.*?)<br>/g,
            "<h2>$1</h2>")

        .replace(/# (.*?)<br>/g,
            "<h1>$1</h1>");

}

// ------------------------------------------------------
// COPY ANSWER
// ------------------------------------------------------

async function copyAnswer() {

    const text =

        document.getElementById(
            "answerContainer"
        ).innerText;

    try {

        await navigator.clipboard.writeText(
            text
        );

        showMessage(
            "Answer copied."
        );

    }

    catch {

        showMessage(
            "Unable to copy."
        );

    }

}

// ------------------------------------------------------
// SHARE ANSWER
// ------------------------------------------------------

async function shareAnswer() {

    const text =

        document.getElementById(
            "answerContainer"
        ).innerText;

    if (navigator.share) {

        try {

            await navigator.share({

                title:
                    CONFIG.APP_NAME,

                text:
                    text

            });

        }

        catch {}

    }

    else {

        copyAnswer();

    }

}

// ======================================================
// END OF VERSION 4.0
// PART 3
// ======================================================

 // ======================================================
// Students Homework AI
// Version 4.0
// PART 4
// Session • Utilities • Events • Footer • Startup
// ======================================================

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

        const student =

            localStorage.getItem(
                "cbseStudent"
            );

        if (student) {

            App.student =
                JSON.parse(student);

        }

        const count =

            parseInt(

                localStorage.getItem(
                    "questionCount"
                )

            );

        if (!isNaN(count)) {

            App.questionCount =
                count;

        }

    }

    catch (error) {

        console.error(error);

        localStorage.removeItem(
            "cbseStudent"
        );

        localStorage.removeItem(
            "questionCount"
        );

    }

}

// ------------------------------------------------------
// MESSAGE
// ------------------------------------------------------

function showMessage(message) {

    if (!UI.message) {

        alert(message);

        return;

    }

    UI.message.textContent = message;

    UI.message.classList.remove("hidden");

    clearTimeout(showMessage.timer);

    showMessage.timer = setTimeout(() => {

        UI.message.classList.add("hidden");

    }, 3000);

}

// ------------------------------------------------------
// FOOTER
// ------------------------------------------------------

function showPrivacyPolicy() {

    alert(

`Privacy Policy

Students Homework AI keeps your registration details secure.

Your homework questions are processed only to generate answers.

No personal information is shared with third parties.`

    );

}

function showTerms() {

    alert(

`Terms & Conditions

• Educational use only.

• Answers are based on NCERT-CBSE syllabus.

• Students should verify answers before submitting homework.

• Features may change with future updates.`

    );

}

function contactUs() {

    window.location.href =

        "mailto:support@studentshomeworkai.in";

}

// ------------------------------------------------------
// QUESTION BOX
// ------------------------------------------------------

document

.getElementById("questionInput")

?.addEventListener(

    "keydown",

    function(e){

        if(

            e.key==="Enter" &&

            !e.shiftKey

        ){

            e.preventDefault();

            askAI();

        }

    }

);

// ------------------------------------------------------
// NETWORK
// ------------------------------------------------------

window.addEventListener(

    "offline",

    function(){

        showMessage(

            "No internet connection."

        );

    }

);

window.addEventListener(

    "online",

    function(){

        showMessage(

            "Internet connected."

        );

    }

);

// ------------------------------------------------------
// AUTO SAVE
// ------------------------------------------------------

document.addEventListener(

    "visibilitychange",

    function(){

        saveSession();

    }

);

window.addEventListener(

    "beforeunload",

    function(){

        saveSession();

    }

);

// ------------------------------------------------------
// ERROR HANDLING
// ------------------------------------------------------

window.addEventListener(

    "error",

    function(event){

        console.error(

            "Application Error",

            event.error

        );

    }

);

window.addEventListener(

    "unhandledrejection",

    function(event){

        console.error(

            "Promise Error",

            event.reason

        );

    }

);

// ------------------------------------------------------
// VERSION INFO
// ------------------------------------------------------

console.log(

"========================================"

);

console.log(

CONFIG.APP_NAME

);

console.log(

"Version " +

CONFIG.VERSION

);

console.log(

"studentshomeworkai.in"

);

console.log(

"NCERT-CBSE Optimized"

);

console.log(

"English + Hindi"

);

console.log(

"Quick Answer + Learn More"

);

console.log(

"========================================"

);

// ======================================================
// END OF SCRIPT.JS
// VERSION 4.0
// Production Build
// ======================================================

// ==========================================
// HOME PAGE NAVIGATION
// ==========================================

function showLoginScreen() {

    document.getElementById("homeScreen")
        ?.classList.add("hidden");

    document.getElementById("loginScreen")
        ?.classList.remove("hidden");

}

function goHome() {

    document.getElementById("loginScreen")
        ?.classList.add("hidden");

    document.getElementById("homeScreen")
        ?.classList.remove("hidden");

}
