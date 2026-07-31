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

   // await sendRegistrationToGoogleSheet();
//const saved = await saveStudentToSupabase();

//if (!saved) {
  //  return;
//}

showMessage(
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

// ======================================================
// Students Homework AI
// VERSION 5.0
// PART 3
// AI Engine • Question • Answer
// ======================================================

// ------------------------------------------------------
// CLEAR QUESTION
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
// ASK AI
// ------------------------------------------------------

async function askAI() {

    if (App.asking) return;

    const box =
        document.getElementById(
            "questionInput"
        );

    if (!box) return;

    const question =
        box.value.trim();

    if (question === "") {

        showMessage(
            "Please enter your homework question."
        );

        box.focus();

        return;

    }

    App.asking = true;

    showLoadingScreen();

    try {

        const response =
            await fetch(

                CONFIG.API_URL,

                {

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

                        studentName:
                            App.student?.name ||

                            "",

                        question:
                            question

                    })

                }

            );

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

        App.questionCount++;

        saveSession();

        updateUsage();

    }

    catch (error) {

        console.error(error);

        displayAnswer(

            "Unable to generate an answer. Please try again."

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

    showAnswerScreen();

    const container =
        document.getElementById(
            "answerContainer"
        );

    if (!container) return;

    container.innerHTML =
        formatAnswer(answer);

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

        .replace(

            /\*\*(.*?)\*\*/g,

            "<strong>$1</strong>"

        );

}

// ------------------------------------------------------
// ASK ANOTHER QUESTION
// ------------------------------------------------------

function askAnotherQuestion() {

    clearQuestion();

    showQuestionScreen();

}

// ------------------------------------------------------
// COPY ANSWER
// ------------------------------------------------------

async function copyAnswer() {

    const text =

        document.getElementById(
            "answerContainer"
        )?.innerText;

    if (!text) return;

    try {

        await navigator.clipboard.writeText(
            text
        );

        showMessage(
            "Answer copied successfully."
        );

    }

    catch {

        showMessage(
            "Unable to copy answer."
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
        )?.innerText;

    if (!text) return;

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

// ------------------------------------------------------
// LEARN MORE
// ------------------------------------------------------

function learnMore() {

    showMessage(

        "Detailed explanations will be available in the next update."

    );

}

// ------------------------------------------------------
// OCR
// ------------------------------------------------------

function startOCR() {

    showMessage(

        "Homework Scan feature is coming soon."

    );

}

// ------------------------------------------------------
// VOICE
// ------------------------------------------------------

function startVoiceInput() {

    showMessage(

        "Voice Question feature is coming soon."

    );

}

// ------------------------------------------------------
// NCERT
// ------------------------------------------------------

function openNCERTSolutions() {

    showMessage(

        "NCERT Solutions will be available soon."

    );

}

// ------------------------------------------------------
// PRINT
// ------------------------------------------------------

function printAnswer() {

    window.print();

}

// ------------------------------------------------------
// ENTER KEY
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

// ======================================================
// END OF VERSION 5.0
// PART 3
// =====================================================
// ======================================================
// Students Homework AI
// VERSION 5.0
// PART 4
// Session • Footer • Referral • Startup
// ======================================================

// ------------------------------------------------------
// PRIVACY POLICY
// ------------------------------------------------------

function showPrivacyPolicy() {

    alert(

`Privacy Policy

Students Homework AI keeps your information secure.

• Registration data is used only for educational purposes.
• Homework questions are processed only to generate answers.
• Personal information is never sold or shared.`

    );

}

// ------------------------------------------------------
// TERMS
// ------------------------------------------------------

function showTerms() {

    alert(

`Terms & Conditions

• Designed for CBSE Classes 6–10.
• AI-generated answers should be verified before submission.
• Features may improve through future updates.`

    );

}

// ------------------------------------------------------
// CONTACT
// ------------------------------------------------------

function contactUs() {

    window.location.href =
        "mailto:support@studentshomeworkai.in";

}

// ------------------------------------------------------
// REFERRAL
// ------------------------------------------------------

function shareReferralLink() {

    const referralLink =

        "https://studentshomeworkai.in";

    if (navigator.share) {

        navigator.share({

            title:
                CONFIG.APP_NAME,

            text:
                "Join Students Homework AI and improve your homework skills!",

            url:
                referralLink

        });

    }

    else {

        navigator.clipboard.writeText(

            referralLink

        );

        showMessage(

            "Referral link copied."

        );

    }

}

function closeReferralSection() {

    document

        .getElementById("referralSection")

        ?.classList.add("hidden");

}

// ------------------------------------------------------
// AUTO SAVE
// ------------------------------------------------------

window.addEventListener(

    "beforeunload",

    function () {

        saveSession();

    }

);

document.addEventListener(

    "visibilitychange",

    function () {

        saveSession();

    }

);

// ------------------------------------------------------
// NETWORK
// ------------------------------------------------------

window.addEventListener(

    "offline",

    function () {

        showMessage(

            "No Internet Connection."

        );

    }

);

window.addEventListener(

    "online",

    function () {

        showMessage(

            "Internet Connected."

        );

    }

);

// ------------------------------------------------------
// ERROR HANDLING
// ------------------------------------------------------

window.addEventListener(

    "error",

    function (event) {

        console.error(

            "Application Error:",

            event.error

        );

    }

);

window.addEventListener(

    "unhandledrejection",

    function (event) {

        console.error(

            "Promise Error:",

            event.reason

        );

    }

);

// ------------------------------------------------------
// STARTUP
// ------------------------------------------------------

document.addEventListener(

    "DOMContentLoaded",

    function () {

        console.log(

            "===================================="

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

            "Production Build Loaded"

        );

        console.log(

            "===================================="

        );

    }

);

// ======================================================
// END OF SCRIPT.JS
// VERSION 5.0
// Production Build
// =======================================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registrationForm");

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            registerStudent();

        });

    }

});


