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


// -------------------------
// MEMBERSHIP PLANS
// -------------------------

const MEMBERSHIP_PLANS = {

    FREE: {
        name: "FREE Trial",
        price: 0,
        validity: 7,
        questions: 30
    },

    BASIC: {
        name: "Basic",
        price: 149,
        validity: 30,
        questions: 100
    },

    STANDARD: {
        name: "Standard",
        price: 199,
        validity: 30,
        questions: 200
    },

    PREMIUM: {
        name: "Premium",
        price: 499,
        validity: 30,
        questions: 249
    }

};

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
const referralCode =
    document.getElementById("referralCode").value.trim();
    

    const button = document.querySelector("#registrationForm button[type='submit']");

    button.disabled = true;
    button.innerHTML = "Registering...";

    try {

        const { data: existingStudent, error: checkError } =
            await window.supabaseClient
                .from("students")
                .select("student_id")
                .eq("mobile_number", mobile)
                .maybeSingle();

        if (checkError) throw checkError;

        if (existingStudent) {
            showMessage(
                "This mobile number is already registered.\nPlease login."
            );
            return;
        }

        const studentId = "SHAI" + Date.now();

        const { error: insertError } = await window.supabaseClient
            .from("students")
            .insert([{
                student_id: studentId,
                name: name,
                student_class: studentClass,
                mobile_number: mobile,
                parent_mobile: parentMobile || null,
                membership: "FREE",
referrer_student_id: referralCode || null
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
    paymentStatus: "trial",
    trial: true,

    questionLimit: MEMBERSHIP_PLANS.FREE.questions,
    questionUsed: 0,

    planExpiry: null,

    joined: new Date().toISOString()
};

     
        saveSession();

        showMessage(
            "Registration Successful!\n\nStudent ID : " + studentId
        );

        showDashboard();

    } catch (error) {

        console.error(error);
        alert(error.message || JSON.stringify(error));
        showMessage("Registration Failed.");

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

    const referralCode =
        document.getElementById(
            "loginReferralCode"
        ).value.trim();

    if (!studentId || !mobile) {

        showMessage(
            "Enter Student ID and Mobile Number."
        );

        return;
    }

    try {

        // ------------------------------------------
        // 1. CHECK STUDENT LOGIN
        // ------------------------------------------

        const {
            data,
            error
        } = await window.supabaseClient

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


        // ------------------------------------------
        // 2. PROCESS REFERRAL
        // ------------------------------------------

        if (referralCode) {

            // Student cannot refer himself
            if (referralCode === studentId) {

                showMessage(
                    "You cannot use your own Student ID as referral code."
                );

                return;
            }


            // Check whether referral Student ID exists
            const {
                data: referrer,
                error: referrerError
            } = await window.supabaseClient

                .from("students")

                .select("student_id")

                .eq(
                    "student_id",
                    referralCode
                )

                .maybeSingle();

            if (referrerError) {
                throw referrerError;
            }

            if (!referrer) {

                showMessage(
                    "Invalid Referral Student ID."
                );

                return;
            }


            // Only process referral if student
            // does not already have a referrer
            if (!data.referrer_student_id) {

                // Update referred student's record
                const {
                    error: updateError
                } = await window.supabaseClient

                    .from("students")

                    .update({
                        referrer_student_id:
                            referralCode
                    })

                    .eq(
                        "student_id",
                        studentId
                    );

                if (updateError) {
                    throw updateError;
                }


                // Create referral relationship
                const {
                    error: referralError
                } = await window.supabaseClient

                    .from("st_referrer")

                    .insert({

                        referrer_student_id:
                            referralCode,

                        referred_student_id:
                            studentId,

                        status:
                            "active",

                        created_at:
                            new Date().toISOString()

                    });

                if (referralError) {
                    throw referralError;
                }
            }
        }


        // ------------------------------------------
        // 3. SAVE STUDENT SESSION
        // ------------------------------------------

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

            referrerStudentId:
                referralCode ||
                data.referrer_student_id

        };


        saveSession();

        alert("Login successful.");

        showDashboard();

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Login Failed."
        );

    }
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

// Check membership question limit
if (App.student.questionUsed >= App.student.questionLimit) {

    showMessage(
        "You have reached your question limit.\n\nPlease upgrade your membership."
    );

    return;

}

    // Count this question
App.student.questionUsed++;
saveSession();

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

        updateDashboard();

        

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


function showUpgradeScreen() {

    hideAllScreens();

    document
        .getElementById("upgradeScreen")
        ?.classList.remove("hidden");

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
