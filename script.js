// =====================================================
// CBSE Homework AI
// script.js Version 2.0
// PART 1
// =====================================================

// -----------------------------
// CONFIGURATION
// -----------------------------

const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL";
const API_URL = "/api/chat";

// -----------------------------
// GLOBAL VARIABLES
// -----------------------------

let currentStudent = null;
let currentClass = "";
let currentSubject = "";
let questionCount = 0;
let maxQuestions = 100;

// -----------------------------
// DOM ELEMENTS
// -----------------------------

const registrationScreen = document.getElementById("registration");
const dashboardScreen = document.getElementById("dashboard");
const subjectScreen = document.getElementById("subjectScreen");
const homeworkScreen = document.getElementById("homeworkScreen");
const questionScreen = document.getElementById("questionScreen");
const loadingScreen = document.getElementById("loadingScreen");
const answerScreen = document.getElementById("answerScreen");

const appMessage = document.getElementById("appMessage");

// -----------------------------
// INITIALIZATION
// -----------------------------

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

    const savedUser =
        localStorage.getItem("cbseStudent");

    if (savedUser) {

        currentStudent = JSON.parse(savedUser);

        showDashboard();

    } else {

        goHome();

    }

}

// -----------------------------
// SCREEN MANAGEMENT
// -----------------------------

function hideAllScreens() {

    registrationScreen.classList.add("hidden");
    dashboardScreen.classList.add("hidden");
    subjectScreen.classList.add("hidden");
    homeworkScreen.classList.add("hidden");
    questionScreen.classList.add("hidden");
    loadingScreen.classList.add("hidden");
    answerScreen.classList.add("hidden");

}

function goHome() {

    hideAllScreens();

    registrationScreen.classList.remove("hidden");

}

function showDashboard() {

    hideAllScreens();

    dashboardScreen.classList.remove("hidden");

    updateDashboard();

}

// -----------------------------
// REGISTRATION
// -----------------------------

async function registerStudent() {

    const name =
        document.getElementById("name").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const email =
        document.getElementById("email").value.trim();

    if (name === "") {

        showMessage("Please enter your name.");

        return;

    }

    if (!/^[0-9]{10}$/.test(mobile)) {

        showMessage("Enter a valid 10-digit mobile number.");

        return;

    }

    if (email === "") {

        showMessage("Please enter your email.");

        return;

    }

    currentStudent = {

        name,
        mobile,
        email,
        trial: true

    };

    localStorage.setItem(
        "cbseStudent",
        JSON.stringify(currentStudent)
    );

    try {

        if (GOOGLE_SCRIPT_URL !== "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL") {

            await fetch(GOOGLE_SCRIPT_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(currentStudent)

            });

        }

    } catch (error) {

        console.error(error);

    }

    showMessage("Registration Successful.");

    showDashboard();

}

// -----------------------------
// DASHBOARD
// -----------------------------

function updateDashboard() {

    if (!currentStudent)
        return;

    const welcome =
        document.getElementById("welcomeMessage");

    if (welcome) {

        welcome.textContent =
            "Welcome, " + currentStudent.name;

    }

    const badge =
        document.getElementById("membershipBadge");

    if (badge) {

        badge.textContent =
            currentStudent.trial
            ? "🆓 7-Day FREE Trial"
            : "⭐ Premium Member";

    }

    updateUsage();

}

function updateUsage() {

    const counter =
        document.getElementById("usageCounter");

    if (counter) {

        counter.innerHTML =
            "Questions Used: <strong>" +
            questionCount +
            " / " +
            maxQuestions +
            "</strong>";

    }

    const bar =
        document.getElementById("usageBar");

    if (bar) {

        const percent =
            (questionCount / maxQuestions) * 100;

        bar.style.width = percent + "%";

    }

}

// -----------------------------
// MESSAGE
// -----------------------------

function showMessage(text) {

    appMessage.textContent = text;

    setTimeout(() => {

        appMessage.textContent = "";

    }, 3000);

}

// =====================================================
// END OF PART 1
// =====================================================
// =====================================================
// CBSE Homework AI
// script.js Version 2.0
// PART 2
// Class → Subject → Homework Navigation
// =====================================================

// -----------------------------
// CLASS SELECTION
// -----------------------------

function showSubjects(className) {

    currentClass = className;

    hideAllScreens();

    subjectScreen.classList.remove("hidden");

    const title =
        document.getElementById("selectedClassTitle");

    if (title) {

        title.textContent =
            "📚 " + className;

    }

}

// -----------------------------
// SUBJECT SELECTION
// -----------------------------

function openHomework(subject) {

    currentSubject = subject;

    hideAllScreens();

    homeworkScreen.classList.remove("hidden");

    const title =
        document.getElementById("selectedSubjectTitle");

    if (title) {

        title.textContent =
            currentClass + " • " + subject;

    }

}

// -----------------------------
// QUESTION SCREEN
// -----------------------------

function showQuestionScreen() {

    hideAllScreens();

    questionScreen.classList.remove("hidden");

    const title =
        document.getElementById("questionScreenTitle");

    if (title) {

        title.textContent =
            currentClass +
            " • " +
            currentSubject;

    }

}

// -----------------------------
// BACK NAVIGATION
// -----------------------------

function goBackToSubjects() {

    hideAllScreens();

    subjectScreen.classList.remove("hidden");

}

function goBackToHomework() {

    hideAllScreens();

    homeworkScreen.classList.remove("hidden");

}

function askAnotherQuestion() {

    const input =
        document.getElementById("questionInput");

    if (input) {

        input.value = "";

        input.focus();

    }

    showQuestionScreen();

}

// -----------------------------
// QUESTION UTILITIES
// -----------------------------

function clearQuestion() {

    const input =
        document.getElementById("questionInput");

    if (!input) return;

    input.value = "";

    input.focus();

}

// -----------------------------
// OCR PLACEHOLDER
// -----------------------------

function startOCR() {

    const picker =
        document.getElementById("ocrFileInput");

    if (picker) {

        picker.click();

    } else {

        showMessage("OCR is not available.");

    }

}

// -----------------------------
// NCERT PLACEHOLDER
// -----------------------------

function openNCERTSolutions() {

    showMessage(
        "NCERT Solutions will be available soon."
    );

}

// -----------------------------
// VOICE INPUT PLACEHOLDER
// -----------------------------

function startVoiceInput() {

    showMessage(
        "Voice Input will be available in a future update."
    );

}

// -----------------------------
// REFERRAL
// -----------------------------

function showReferralProgram() {

    const section =
        document.getElementById("referralSection");

    if (section) {

        section.classList.remove("hidden");

    }

}

function closeReferralSection() {

    const section =
        document.getElementById("referralSection");

    if (section) {

        section.classList.add("hidden");

    }

}

// -----------------------------
// PREMIUM PLACEHOLDERS
// -----------------------------

function showSubscriptionPlans() {

    showMessage(
        "Subscription plans coming soon."
    );

}

// -----------------------------
// FOOTER
// -----------------------------

function showPrivacyPolicy() {

    alert(
        "Privacy Policy will be added before launch."
    );

}

function showTerms() {

    alert(
        "Terms & Conditions will be added before launch."
    );

}

function contactUs() {

    alert(
        "Contact support: support@studentshomeworkhelp.in"
    );

}

// =====================================================
// END OF PART 2
// =====================================================
// =====================================================
// CBSE Homework AI
// script.js Version 2.0
// PART 3
// AI Integration
// =====================================================

// -----------------------------
// ASK AI
// -----------------------------

async function askAI() {

    const questionBox =
        document.getElementById("questionInput");

    const question =
        questionBox.value.trim();

    if (question === "") {

        showMessage("Please enter your question.");

        return;

    }

    hideAllScreens();

    loadingScreen.classList.remove("hidden");

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                className: currentClass,
                subject: currentSubject,
                question: question

            })

        });

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        let answer = "";

        // Supports multiple response formats

        if (typeof data === "string") {

            answer = data;

        } else if (data.answer) {

            answer = data.answer;

        } else if (data.text) {

            answer = data.text;

        } else if (data.result) {

            answer = data.result;

        } else {

            answer = "No answer received.";

        }

        displayAnswer(answer);

        questionCount++;

        updateUsage();

    }

    catch (error) {

        console.error(error);

        hideAllScreens();

        answerScreen.classList.remove("hidden");

        document.getElementById(
            "answerContainer"
        ).innerHTML =

        "<h3>❌ Error</h3>" +
        "<p>Unable to contact the AI server.</p>" +
        "<p>Please try again in a few moments.</p>";

    }

}

// -----------------------------
// DISPLAY ANSWER
// -----------------------------

function displayAnswer(answer) {

    hideAllScreens();

    answerScreen.classList.remove("hidden");

    const container =
        document.getElementById("answerContainer");

    container.innerHTML =
        formatAnswer(answer);

}

// -----------------------------
// FORMAT ANSWER
// -----------------------------

function formatAnswer(text) {

    if (!text)
        return "";

    return text

        .replace(/\n/g, "<br>")

        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

        .replace(/\*(.*?)\*/g, "<em>$1</em>");

}

// -----------------------------
// COPY ANSWER
// -----------------------------

async function copyAnswer() {

    const text =
        document.getElementById(
            "answerContainer"
        ).innerText;

    try {

        await navigator.clipboard.writeText(text);

        showMessage("Answer copied.");

    }

    catch {

        showMessage("Copy failed.");

    }

}

// -----------------------------
// SHARE ANSWER
// -----------------------------

async function shareAnswer() {

    const text =
        document.getElementById(
            "answerContainer"
        ).innerText;

    if (navigator.share) {

        try {

            await navigator.share({

                title:
                "CBSE Homework AI",

                text: text

            });

        }

        catch (e) {

            console.log(e);

        }

    }

    else {

        copyAnswer();

    }

}

// =====================================================
// END OF PART 3
// =====================================================
// =====================================================
// CBSE Homework AI
// script.js Version 2.0
// PART 4
// Final Utilities & Session Management
// =====================================================

// -----------------------------
// LOGOUT
// -----------------------------

function logoutStudent() {

    if (!confirm("Do you want to logout?")) {
        return;
    }

    localStorage.removeItem("cbseStudent");

    currentStudent = null;
    currentClass = "";
    currentSubject = "";
    questionCount = 0;

    goHome();

    showMessage("Logged out successfully.");

}

// -----------------------------
// SAVE SESSION
// -----------------------------

function saveSession() {

    if (!currentStudent) return;

    localStorage.setItem(
        "cbseStudent",
        JSON.stringify(currentStudent)
    );

}

// -----------------------------
// LOAD SESSION
// -----------------------------

function loadSession() {

    const data =
        localStorage.getItem("cbseStudent");

    if (!data)
        return false;

    try {

        currentStudent =
            JSON.parse(data);

        return true;

    }

    catch {

        localStorage.removeItem("cbseStudent");

        return false;

    }

}

// -----------------------------
// NETWORK CHECK
// -----------------------------

window.addEventListener("offline", () => {

    showMessage("No Internet Connection.");

});

window.addEventListener("online", () => {

    showMessage("Internet Connected.");

});

// -----------------------------
// OCR IMAGE
// -----------------------------

const ocrInput =
    document.getElementById("ocrFileInput");

if (ocrInput) {

    ocrInput.addEventListener("change", function () {

        if (!this.files.length)
            return;

        showMessage(
            "OCR feature will be enabled soon."
        );

    });

}

// -----------------------------
// OPTIONAL IMAGE
// -----------------------------

const imageInput =
    document.getElementById("imageInput");

if (imageInput) {

    imageInput.addEventListener("change", function () {

        if (!this.files.length)
            return;

        showMessage(
            "Image uploaded."
        );

    });

}

// -----------------------------
// PREVENT DOUBLE SUBMISSION
// -----------------------------

let askingAI = false;

const originalAskAI = askAI;

askAI = async function () {

    if (askingAI) {

        showMessage(
            "Please wait..."
        );

        return;

    }

    askingAI = true;

    try {

        await originalAskAI();

    }

    finally {

        askingAI = false;

    }

};

// -----------------------------
// ESC KEY
// -----------------------------

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        goBackToHomework();

    }

});

// -----------------------------
// STARTUP
// -----------------------------

window.addEventListener("load", () => {

    loadSession();

    updateDashboard();

});

// =====================================================
// END OF SCRIPT
// =====================================================

console.log(
    "CBSE Homework AI Version 2.0 Loaded Successfully"
);
