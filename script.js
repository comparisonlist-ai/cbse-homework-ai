// ======================================================
// Students Homework AI
// Version 5.1
// script.js
// PART 1
// Configuration • State • Initialization • Navigation
// ======================================================

// ------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------

const CONFIG = {

    APP_NAME:
        "Students Homework AI",

    VERSION:
        "5.1",

    API_URL:
        "/api/chat",

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
        CONFIG.DEFAULT_LANGUAGE,

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

function showRegistrationScreen() {

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

        .getElementById("dashboardScreen")

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

// ------------------------------------------------------
// SESSION
// ------------------------------------------------------

function saveSession() {

    if (!App.student) return;

    localStorage.setItem(

        "studentData",

        JSON.stringify(App.student)

    );

}

function loadSession() {

    try {

        const saved =

            localStorage.getItem(

                "studentData"

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

    box.textContent =

        message;

    box.classList.remove(

        "hidden"

    );

    clearTimeout(

        showMessage.timer

    );

    showMessage.timer =

        setTimeout(() => {

            box.classList.add(

                "hidden"

            );

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
// END OF PART 1
// ======================================================

// ======================================================
// Students Homework AI
// Version 5.1
// PART 2
// Registration • Login • Dashboard • Logout
// ======================================================

async function registerStudent() {

    const name = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value;
    const mobile = document.getElementById("studentMobile").value.trim();
    const parentMobile = document.getElementById("parentMobile").value.trim();

    const button = document.querySelector("#registrationForm button[type='submit']");

    button.disabled = true;
    button.innerHTML = "Registering...";

    try {

        const studentId = "SHAI" + Date.now();

        const joined = new Date().toISOString();

        const { error: insertError } = await supabase
            .from("students")
            .insert([{
                student_id: studentId,
                name: name,
                student_class: studentClass,
                mobile_number: mobile,
                parent_mobile: parentMobile || null,
                membership: "FREE",
                joined: joined
            }]);

        if (insertError) {
            throw insertError;
        }

        App.student = {
            studentId: studentId,
            name: name,
            studentClass: studentClass,
            mobile: mobile,
            parentMobile: parentMobile,
            membership: "FREE",
            joined: joined
        };

        saveSession();

        showMessage(
            "Registration Successful!\n\nStudent ID : " + studentId
        );

        showDashboard();

    } 

    catch (error) {

    console.log(error);

    alert(
        "Message: " + error.message +
        "\n\nName: " + error.name +
        "\n\nStack:\n" + error.stack
    );

    showMessage(
        error.message || "Registration Failed."
    );


    } finally {

        button.disabled = false;
        button.innerHTML = "🚀 Register";

    }

}

// ------------------------------------------------------
// LOGIN
// ------------------------------------------------------

async function loginStudent() {

    const studentId =
        document.getElementById(
            "loginStudentId"
        ).value.trim();

    const mobile =
        document.getElementById(
            "loginMobile"
        ).value.trim();

    if (

        !studentId ||

        !mobile

    ) {

        showMessage(

            "Enter Student ID and Mobile Number."

        );

        return;

    }

    try {

        const {

            data,

            error

        } = await supabase

            .from("students")

            .select("*")

            .eq(
                "student_id",
                studentId
            )

            .eq(
                "mobile_number",
                mobile
            )

            .maybeSingle();

        if (error) {

            throw error;

        }

        if (!data) {

            showMessage(

                "Invalid Student ID or Mobile Number."

            );

            return;

        }

        App.student = {

            studentId:
                data.student_id,

            name:
                data.name,

            studentClass:
                data.student_class,

            mobile:
                data.mobile_number,

            parentMobile:
                data.parent_mobile,

            membership:
                data.membership,

            joined:
                data.joined

        };

        saveSession();

        showDashboard();

    }

    catch (error) {

        console.error(error);

        showMessage(

            "Login Failed."

        );

    }

}

// ------------------------------------------------------
// DASHBOARD
// ------------------------------------------------------

function updateDashboard() {

    if (!App.student) return;

    document.getElementById(

        "studentInfo"

    ).innerHTML =

        "<strong>" +

        App.student.name +

        "</strong><br><br>" +

        "Student ID : " +

        App.student.studentId +

        "<br>" +

        "Class : " +

        App.student.studentClass;

}

// ------------------------------------------------------
// LOGOUT
// ------------------------------------------------------

function logoutStudent() {

    localStorage.removeItem(

        "studentData"

    );

    App.student = null;

    showHome();

}

// ======================================================
// END OF PART 2
// ======================================================

// ======================================================
// Students Homework AI
// Version 5.1
// PART 3
// Subject • Homework • AI • Answer
// ======================================================

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

        className +

        " Subjects";

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
// AI QUESTION
// ------------------------------------------------------

async function askAI() {

    if (App.asking) {

        return;

    }

    const question =

        document.getElementById(

            "questionInput"

        ).value.trim();

    if (!question) {

        showMessage(

            "Please enter your homework question."

        );

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

                            App.student.name,

                        question:

                            question

                    })

                }

            );

        if (!response.ok) {

            throw new Error(

                "Unable to contact AI server."

            );

        }

        const result =

            await response.json();

        displayAnswer(

            result.answer ||

            result.text ||

            "No answer received."

        );

    }

    catch (error) {

        console.error(error);

        displayAnswer(

            "Sorry, AI is currently unavailable. Please try again."

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

    document.getElementById(

        "answerContainer"

    ).innerHTML =

        formatAnswer(answer);

    showAnswerScreen();

}

// ------------------------------------------------------
// FORMAT ANSWER
// ------------------------------------------------------

function formatAnswer(text) {

    if (!text) {

        return "";

    }

    return text

        .replace(/\r\n/g, "\n")

        .replace(/\n\n/g, "<br><br>")

        .replace(/\n/g, "<br>")

        .replace(

            /\*\*(.*?)\*\*/g,

            "<strong>$1</strong>"

        );

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

            "Unable to copy answer."

        );

    }

}

// ------------------------------------------------------
// PLACEHOLDER FEATURES
// ------------------------------------------------------

function startOCR() {

    showMessage(

        "Homework Scanner coming soon."

    );

}

function startVoiceInput() {

    showMessage(

        "Voice Question feature coming soon."

    );

}

function openNCERTSolutions() {

    showMessage(

        "NCERT Solutions coming soon."

    );

}

// ======================================================
// END OF PART 3
// ======================================================

// ======================================================
// Students Homework AI
// Version 5.1
// PART 4
// Footer • Utilities • Events
// ======================================================

// ------------------------------------------------------
// PRIVACY POLICY
// ------------------------------------------------------

function showPrivacyPolicy() {

    alert(

`Privacy Policy

Students Homework AI uses your
registration details only for
providing educational services.

Your personal information is
never sold or shared.`

    );

}

// ------------------------------------------------------
// TERMS
// ------------------------------------------------------

function showTerms() {

    alert(

`Terms & Conditions

• Designed for CBSE Classes 6–10

• AI answers should always be
verified before submission.

• Features will improve through
future updates.`

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
// NETWORK STATUS
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
// ENTER KEY
// ------------------------------------------------------

document.addEventListener(

    "DOMContentLoaded",

    function () {

        const questionBox =

            document.getElementById(

                "questionInput"

            );

        if (questionBox) {

            questionBox.addEventListener(

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

        const form =

            document.getElementById(

                "registrationForm"

            );

        if (form) {

            form.addEventListener(

                "submit",

                function (e) {

                    e.preventDefault();

                    registerStudent();

                }

            );

        }

    }

);

// ------------------------------------------------------
// GLOBAL ERROR HANDLING
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

// ======================================================
// END OF SCRIPT.JS
// Version 5.1
// ======================================================
