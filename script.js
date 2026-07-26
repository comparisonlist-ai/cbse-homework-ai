// =====================================================
// Students Homework AI
// script.js Version 3.0
// PART 1
// Configuration • Initialization • Registration • Dashboard
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

let currentLanguage =
    localStorage.getItem("answerLanguage") || "English";

let questionCount = 0;
let maxQuestions = 100;

let askingAI = false;

// -----------------------------
// DOM ELEMENTS
// -----------------------------

const registrationScreen =
    document.getElementById("registration");

const dashboardScreen =
    document.getElementById("dashboard");

const subjectScreen =
    document.getElementById("subjectScreen");

const homeworkScreen =
    document.getElementById("homeworkScreen");

const questionScreen =
    document.getElementById("questionScreen");

const loadingScreen =
    document.getElementById("loadingScreen");

const answerScreen =
    document.getElementById("answerScreen");

const appMessage =
    document.getElementById("appMessage");

// -----------------------------
// INITIALIZATION
// -----------------------------

document.addEventListener(
    "DOMContentLoaded",
    initApp
);

function initApp() {

    loadSession();

    initializeLanguageButtons();

    if (currentStudent) {

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
// LANGUAGE
// -----------------------------

function initializeLanguageButtons() {

    const homeEnglish =
        document.getElementById("englishBtn");

    const homeHindi =
        document.getElementById("hindiBtn");

    const dashEnglish =
        document.getElementById("dashboardEnglish");

    const dashHindi =
        document.getElementById("dashboardHindi");

    function updateButtons() {

        document
            .querySelectorAll(".language-btn")
            .forEach(btn =>
                btn.classList.remove("active")
            );

        if (currentLanguage === "English") {

            homeEnglish?.classList.add("active");
            dashEnglish?.classList.add("active");

        } else {

            homeHindi?.classList.add("active");
            dashHindi?.classList.add("active");

        }

    }

    homeEnglish?.addEventListener("click", () => {

        currentLanguage = "English";
        localStorage.setItem(
            "answerLanguage",
            currentLanguage
        );

        updateButtons();

    });

    dashEnglish?.addEventListener("click", () => {

        currentLanguage = "English";
        localStorage.setItem(
            "answerLanguage",
            currentLanguage
        );

        updateButtons();

    });

    homeHindi?.addEventListener("click", () => {

        currentLanguage = "Hindi";
        localStorage.setItem(
            "answerLanguage",
            currentLanguage
        );

        updateButtons();

    });

    dashHindi?.addEventListener("click", () => {

        currentLanguage = "Hindi";
        localStorage.setItem(
            "answerLanguage",
            currentLanguage
        );

        updateButtons();

    });

    updateButtons();

}

// -----------------------------
// REGISTRATION
// -----------------------------

async function registerStudent() {

    const name =
        document.getElementById("name")
        .value.trim();

    const mobile =
        document.getElementById("mobile")
        .value.trim();

    const email =
        document.getElementById("email")
        .value.trim();

    if (!name) {

        showMessage("Please enter your name.");

        return;

    }

    if (!/^[0-9]{10}$/.test(mobile)) {

        showMessage(
            "Enter a valid 10-digit mobile number."
        );

        return;

    }

    if (!email) {

        showMessage(
            "Please enter your email."
        );

        return;

    }

    currentStudent = {

        name,
        mobile,
        email,
        trial: true,
        language: currentLanguage

    };

    saveSession();

    try {

        if (
            GOOGLE_SCRIPT_URL !==
            "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL"
        ) {

            await fetch(
                GOOGLE_SCRIPT_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                        "application/json"

                    },

                    body: JSON.stringify(
                        currentStudent
                    )

                }
            );

        }

    } catch (err) {

        console.log(err);

    }

    showMessage(
        "Registration Successful."
    );

    showDashboard();

}

// -----------------------------
// DASHBOARD
// -----------------------------

function updateDashboard() {

    if (!currentStudent) return;

    const welcome =
        document.getElementById(
            "welcomeMessage"
        );

    if (welcome) {

        welcome.textContent =
            "Welcome, " +
            currentStudent.name;

    }

    const badge =
        document.getElementById(
            "membershipBadge"
        );

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
        document.getElementById(
            "usageCounter"
        );

    if (counter) {

        counter.innerHTML =
            "Questions Used: <strong>" +
            questionCount +
            " / " +
            maxQuestions +
            "</strong>";

    }

    const bar =
        document.getElementById(
            "usageBar"
        );

    if (bar) {

        const percent = Math.min(
            (questionCount / maxQuestions) * 100,
            100
        );

        bar.style.width =
            percent + "%";

    }
    

}

// -----------------------------
// MESSAGE
// -----------------------------

function showMessage(text) {

    if (!appMessage) return;

    appMessage.textContent = text;

    appMessage.style.display = "block";

    clearTimeout(showMessage.timer);

    showMessage.timer = setTimeout(() => {

        appMessage.textContent = "";

        appMessage.style.display = "";

    }, 3000);

}

// =====================================================
// END OF PART 1
// =====================================================
// =====================================================
// Students Homework AI
// script.js Version 3.0
// PART 2
// Navigation • Subject • Homework • Question Utilities
// =====================================================

// -----------------------------
// CLASS SELECTION
// -----------------------------

function showSubjects(className) {

    currentClass = className;

    hideAllScreens();

    subjectScreen.classList.remove("hidden");

    const title =
        document.getElementById(
            "selectedClassTitle"
        );

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
        document.getElementById(
            "selectedSubjectTitle"
        );

    if (title) {

        title.textContent =
            currentClass +
            " • " +
            subject;

    }

}

// -----------------------------
// QUESTION SCREEN
// -----------------------------

function showQuestionScreen() {

    hideAllScreens();

    questionScreen.classList.remove("hidden");

    const title =
        document.getElementById(
            "questionScreenTitle"
        );

    if (title) {

        title.textContent =
            currentClass +
            " • " +
            currentSubject;

    }

    const input =
        document.getElementById(
            "questionInput"
        );

    if (input) {

        input.focus();

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

    clearQuestion();

    showQuestionScreen();

}

// -----------------------------
// QUESTION UTILITIES
// -----------------------------

function clearQuestion() {

    const input =
        document.getElementById(
            "questionInput"
        );

    if (!input)
        return;

    input.value = "";

    input.focus();

}

// -----------------------------
// OCR
// -----------------------------

function startOCR() {

    const picker =
        document.getElementById(
            "ocrFileInput"
        );

    if (!picker) {

        showMessage(
            "OCR is unavailable."
        );

        return;

    }

    picker.click();

}

// -----------------------------
// OCR FILE
// -----------------------------

const ocrInput =
    document.getElementById(
        "ocrFileInput"
    );

if (ocrInput) {

    ocrInput.addEventListener(
        "change",
        function () {

            if (!this.files.length)
                return;

            showMessage(
                "OCR feature will be enabled in the next update."
            );

            this.value = "";

        }
    );

}

// -----------------------------
// IMAGE FILE
// -----------------------------

const imageInput =
    document.getElementById(
        "imageInput"
    );

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            if (!this.files.length)
                return;

            showMessage(
                "Image selected successfully."
            );

            this.value = "";

        }
    );

}

// -----------------------------
// VOICE INPUT
// -----------------------------

function startVoiceInput() {

    if (
        !(
            "webkitSpeechRecognition" in window
        ) &&
        !(
            "SpeechRecognition" in window
        )
    ) {

        showMessage(
            "Voice input is not supported on this device."
        );

        return;

    }

    showMessage(
        "Voice input feature coming soon."
    );

}

// -----------------------------
// NCERT
// -----------------------------

function openNCERTSolutions() {

    showMessage(
        "NCERT Solutions will be available shortly."
    );

}

// -----------------------------
// REFERRAL
// -----------------------------

function showReferralProgram() {

    const section =
        document.getElementById(
            "referralSection"
        );

    if (section) {

        section.classList.remove(
            "hidden"
        );

    }

}

function closeReferralSection() {

    const section =
        document.getElementById(
            "referralSection"
        );

    if (section) {

        section.classList.add(
            "hidden"
        );

    }

}

// -----------------------------
// PREMIUM
// -----------------------------

function showSubscriptionPlans() {

    showMessage(
        "Premium plans will be available soon."
    );

}

// -----------------------------
// FOOTER
// -----------------------------

function showPrivacyPolicy() {

    alert(
        "Privacy Policy will be published before launch."
    );

}

function showTerms() {

    alert(
        "Terms & Conditions will be published before launch."
    );

}

function contactUs() {

    window.location.href =
        "mailto:support@studentshomeworkai.in";

}

// -----------------------------
// ENTER KEY SUPPORT
// -----------------------------

const questionInput =
    document.getElementById(
        "questionInput"
    );

if (questionInput) {

    questionInput.addEventListener(
        "keydown",
        function (e) {

            if (
                e.key === "Enter" &&
                !e.shiftKey
            ) {

                e.preventDefault();

                askAI();

            }

        }
    );

}

// =====================================================
// END OF PART 2
// =====================================================
// =====================================================
// Students Homework AI
// script.js Version 3.0
// PART 3
// AI Integration • Answer Display • Copy • Share
// =====================================================

// -----------------------------
// ASK AI
// -----------------------------

async function askAI() {

    if (askingAI) {

        showMessage("Please wait...");

        return;

    }

    const questionBox =
        document.getElementById("questionInput");

    if (!questionBox) return;

    const question =
        questionBox.value.trim();

    if (question === "") {

        showMessage("Please enter your question.");

        questionBox.focus();

        return;

    }

    askingAI = true;

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

                language: currentLanguage,

                question: question

            })

        });

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data =
            await response.json();

        let answer = "";

        if (typeof data === "string") {

            answer = data;

        }

        else if (data.answer) {

            answer = data.answer;

        }

        else if (data.text) {

            answer = data.text;

        }

        else if (data.result) {

            answer = data.result;

        }

        else if (data.message) {

            answer = data.message;

        }

        else {

            answer =
                "Sorry, no answer was received.";

        }

        displayAnswer(answer);

        questionCount++;

        updateUsage();

    }

    catch (error) {

        console.error(error);

        hideAllScreens();

        answerScreen.classList.remove("hidden");

        document
            .getElementById("answerContainer")
            .innerHTML =

            "<h2>❌ Unable to Get Answer</h2>" +

            "<p>Please check your internet connection and try again.</p>";

    }

    finally {

        askingAI = false;

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

    if (!container) return;

    container.innerHTML =
        formatAnswer(answer);

}

// -----------------------------
// FORMAT ANSWER
// -----------------------------

function formatAnswer(text) {

    if (!text) return "";

    let html = text;

    html = html

        .replace(/\r\n/g, "\n")

        .replace(/\n\n/g, "<br><br>")

        .replace(/\n/g, "<br>")

        .replace(/\*\*(.*?)\*\*/g,
            "<strong>$1</strong>")

        .replace(/\*(.*?)\*/g,
            "<em>$1</em>")

        .replace(/### (.*?)<br>/g,
            "<h3>$1</h3>")

        .replace(/## (.*?)<br>/g,
            "<h2>$1</h2>")

        .replace(/# (.*?)<br>/g,
            "<h1>$1</h1>")

        .replace(/^- (.*?)(<br>|$)/gm,
            "• $1<br>");

    return html;

}

// -----------------------------
// COPY ANSWER
// -----------------------------

async function copyAnswer() {

    const container =
        document.getElementById("answerContainer");

    if (!container) return;

    try {

        await navigator.clipboard.writeText(

            container.innerText

        );

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

    const container =
        document.getElementById("answerContainer");

    if (!container) return;

    const text =
        container.innerText;

    if (navigator.share) {

        try {

            await navigator.share({

                title:
                "Students Homework AI",

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

// -----------------------------
// PRINT ANSWER
// -----------------------------

function printAnswer() {

    const container =
        document.getElementById("answerContainer");

    if (!container) return;

    const win =
        window.open("", "_blank");

    win.document.write(

        "<html><head><title>Answer</title></head><body>" +

        container.innerHTML +

        "</body></html>"

    );

    win.document.close();

    win.print();

}

// =====================================================
// END OF PART 3
// =====================================================
// =====================================================
// Students Homework AI
// script.js Version 3.0
// PART 4
// Session • Logout • Network • Startup
// =====================================================

// -----------------------------
// LOGOUT
// -----------------------------

function logoutStudent() {

    if (!confirm("Do you want to logout?")) {

        return;

    }

    localStorage.removeItem(
        "cbseStudent"
    );

    currentStudent = null;

    currentClass = "";

    currentSubject = "";

    questionCount = 0;

    goHome();

    showMessage(
        "Logged out successfully."
    );

}

// -----------------------------
// SAVE SESSION
// -----------------------------

function saveSession() {

    if (!currentStudent)
        return;

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

        localStorage.getItem(
            "cbseStudent"
        );

    if (!data) {

        return false;

    }

    try {

        currentStudent =
            JSON.parse(data);

        return true;

    }

    catch (error) {

        console.error(error);

        localStorage.removeItem(
            "cbseStudent"
        );

        return false;

    }

}

// -----------------------------
// RESET USAGE
// -----------------------------

function resetUsage() {

    questionCount = 0;

    updateUsage();

}

// -----------------------------
// NETWORK STATUS
// -----------------------------

window.addEventListener(
    "offline",
    () => {

        showMessage(
            "❌ No Internet Connection"
        );

    }
);

window.addEventListener(
    "online",
    () => {

        showMessage(
            "✅ Internet Connected"
        );

    }
);

// -----------------------------
// ESC KEY
// -----------------------------

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Escape") {

            if (

                !questionScreen.classList.contains(
                    "hidden"
                )

            ) {

                goBackToHomework();

            }

        }

    }
);

// -----------------------------
// PAGE VISIBILITY
// -----------------------------

document.addEventListener(

    "visibilitychange",

    function () {

        if (
            document.hidden
        ) {

            saveSession();

        }

    }

);

// -----------------------------
// BEFORE UNLOAD
// -----------------------------

window.addEventListener(

    "beforeunload",

    function () {

        saveSession();

    }

);

// -----------------------------
// WINDOW LOAD
// -----------------------------

window.addEventListener(

    "load",

    function () {

        loadSession();

        initializeLanguageButtons();

        if (currentStudent) {

            showDashboard();

        }

        else {

            goHome();

        }

    }

);

// -----------------------------
// GLOBAL ERROR HANDLER
// -----------------------------

window.addEventListener(

    "error",

    function (event) {

        console.error(

            "Application Error:",

            event.error

        );

    }

);

// -----------------------------
// PROMISE ERROR HANDLER
// -----------------------------

window.addEventListener(

    "unhandledrejection",

    function (event) {

        console.error(

            "Unhandled Promise:",

            event.reason

        );

    }

);

// -----------------------------
// VERSION INFO
// -----------------------------

console.log(

    "===================================="

);

console.log(

    "Students Homework AI"

);

console.log(

    "Version 3.0"

);

console.log(

    "Production Ready"

);

console.log(

    "studentshomeworkai.in"

);

console.log(

    "===================================="

);

// =====================================================
// END OF SCRIPT.JS
// Version 3.0
// Production Build
// =====================================================
