// ======================================================
// CBSE Homework AI
// script.js V2
// PART 1A - REPLACE FROM THE TOP OF script.js
// ======================================================

// -----------------------------
// Configuration
// -----------------------------

const ACCESS_CODE = "CBSE2026";
const GOOGLE_FORM =
    "https://forms.gle/angKKgWnByvNvffb7";

const TRIAL_DAYS = 7;
const TRIAL_QUESTIONS = 30;

// -----------------------------
// Local Storage
// -----------------------------

function getStudent() {

    return JSON.parse(
        localStorage.getItem("student")
    );

}

function saveStudent(student) {

    localStorage.setItem(
        "student",
        JSON.stringify(student)
    );

}

function isRegistered() {

    return getStudent() !== null;

}

// -----------------------------
// Trial
// -----------------------------

function startFreeTrial() {

    if (!localStorage.getItem("trialStart")) {

        localStorage.setItem(
            "trialStart",
            Date.now()
        );

        localStorage.setItem(
            "questionCount",
            "0"
        );

    }

}

function checkTrialStatus() {

    const trialStart =
        Number(localStorage.getItem("trialStart"));

    const questionCount =
        Number(localStorage.getItem("questionCount") || 0);

    if (!trialStart) {

        return {

            allowed: false,

            message:
                "Please start your FREE Trial."

        };

    }

    const daysPassed =
        (Date.now() - trialStart) /
        (1000 * 60 * 60 * 24);

    if (daysPassed >= TRIAL_DAYS) {

        return {

            allowed: false,

            message:
                "Your FREE Trial has expired."

        };

    }

    if (questionCount >= TRIAL_QUESTIONS) {

        return {

            allowed: false,

            message:
                "You have used all FREE questions."

        };

    }

    return {

        allowed: true,

        used: questionCount,

        remaining:
            TRIAL_QUESTIONS - questionCount

    };

}

function increaseQuestionCount() {

    let count =
        Number(localStorage.getItem("questionCount") || 0);

    count++;

    localStorage.setItem(
        "questionCount",
        count
    );

}

// -----------------------------
// Home Screen
// -----------------------------

function showHome() {

    const container =
        document.querySelector(".container");

    container.innerHTML = `

<div class="welcome-card">

<h1>🎓 Students Homework AI</h1>

<p class="tagline">
AI Homework Help for Classes 6–10
<br><br>
NCERT-CBSE Friendly • Instant Answers • 7-Day FREE Trial
</p>

<div class="badge">
Class 6 • Class 7 • Class 8 • Class 9 • Class 10
</div>

<br>

${
isRegistered()

?

`<div id="classSection">

<h2>Select Your Class</h2>

<button id="class6">📘 Class 6</button>

<button id="class7">📗 Class 7</button>

<button id="class8">📙 Class 8</button>

<button id="class9">📕 Class 9</button>

<button id="class10">🎓 Class 10</button>

</div>`

:

`<button
class="register-btn"
onclick="openRegistration()">

🎁 Try Your 7-Day FREE Trial

</button>`

}

<hr>

<div class="features">

<p>🤖 AI Homework Help</p>

<p>📚 NCERT Friendly</p>

<p>⚡ Instant Answers</p>

<p>🎤 Voice Support</p>

</div>

<hr>

<p class="footer">

Made with Care by Sibaram

<br><br>

Made for CBSE Students (Class 6 - 10) ❤️

</p>

</div>

`;

}

// ======================================================
// CBSE Homework AI
// script.js V2
// PART 1B
// PASTE IMMEDIATELY AFTER PART 1A
// ======================================================

// -----------------------------
// Google Form
// -----------------------------

function openRegistration() {

    window.open(
        GOOGLE_FORM,
        "_blank"
    );

    setTimeout(function () {

        showAccessCodeScreen();

    }, 1000);

}

// -----------------------------
// Access Code Screen
// -----------------------------

function showAccessCodeScreen() {

    document.querySelector(".container").innerHTML = `

<div class="welcome-card">

<h2>🔑 Enter Access Code</h2>

<p>

After submitting the Google Form,
enter your Access Code below.

</p>

<input

id="accessCode"

type="text"

placeholder="Enter Access Code">

<br><br>

<button onclick="verifyAccessCode()">

Start FREE Trial

</button>

<br><br>

<button onclick="showHome()">

⬅ Back

</button>

</div>

`;

}

// -----------------------------
// Verify Access Code
// -----------------------------

function verifyAccessCode() {

    const code =

        document
        .getElementById("accessCode")
        .value
        .trim();

    if (code !== ACCESS_CODE) {

        alert(
            "Invalid Access Code."
        );

        return;

    }

    saveStudent({

        registered: true,

        joined:
            new Date().toLocaleDateString()

    });

    startFreeTrial();

    alert(
        "FREE Trial Started Successfully."
    );

    showHome();

}

// -----------------------------
// Home Events
// -----------------------------

document.addEventListener(
    "click",
    function (e) {

        if (e.target.id === "class6")
            showClassDashboard("Class 6");

        if (e.target.id === "class7")
            showClassDashboard("Class 7");

        if (e.target.id === "class8")
            showClassDashboard("Class 8");

        if (e.target.id === "class9")
            showClassDashboard("Class 9");

        if (e.target.id === "class10")
            showClassDashboard("Class 10");

    }
);

// -----------------------------
// App Start
// -----------------------------

window.onload = function () {

    showHome();

};

// ======================================================
// END OF PART 1B
// ======================================================

