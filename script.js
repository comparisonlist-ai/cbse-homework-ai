// ======================================================
// CBSE Homework AI
// script.js
// PART 1
// ======================================================

// -----------------------------
// Student Registration
// -----------------------------
// -----------------------------
// Free Trial Settings
// -----------------------------

const TRIAL_DAYS = 7;
const TRIAL_QUESTIONS = 30;

function startFreeTrial() {

    if (!localStorage.getItem("trialStart")) {

        localStorage.setItem("trialStart", Date.now());

        localStorage.setItem("questionCount", "0");

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

            message: "Please register first."

        };

    }

    const daysPassed =
        (Date.now() - trialStart) /
        (1000 * 60 * 60 * 24);

    if (daysPassed >= TRIAL_DAYS) {

        return {

            allowed: false,

            message:
            "Your 7-Day FREE Trial has ended."

        };

    }

    if (questionCount >= TRIAL_QUESTIONS) {

        return {

            allowed: false,

            message:
            "You have used all 30 FREE questions."

        };

    }

    return {

        allowed: true,

        remaining:
            TRIAL_QUESTIONS - questionCount,

        used:
            questionCount

    };

}

function increaseQuestionCount() {

    let count =
        Number(localStorage.getItem("questionCount") || 0);

    count++;

    localStorage.setItem("questionCount", count);

}


function getStudent() {
    return JSON.parse(localStorage.getItem("student"));
}

function saveStudent(student) {
    localStorage.setItem("student", JSON.stringify(student));
}

function generateStudentID() {
    return "CBSE" + Date.now();
}

// -----------------------------
// Home
// -----------------------------

function goHome() {
    location.reload();
}

// -----------------------------
// Registration Screen
// -----------------------------

function showRegistration(selectedClass = "") {

    document.querySelector(".container").innerHTML = `

        <div class="welcome-card">

            <h2>📝 Student Registration</h2>

            <input
                id="studentName"
                type="text"
                placeholder="Full Name">

            <br><br>

            <input
                id="studentMobile"
                type="tel"
                placeholder="Mobile Number">

            <br><br>

            <select id="studentClass">

                <option value="">Select Class</option>

                <option value="Class 6" ${selectedClass==="Class 6"?"selected":""}>
                    Class 6
                </option>

                <option value="Class 7" ${selectedClass==="Class 7"?"selected":""}>
                    Class 7
                </option>

                <option value="Class 8" ${selectedClass==="Class 8"?"selected":""}>
                    Class 8
                </option>

                <option value="Class 9" ${selectedClass==="Class 9"?"selected":""}>
                    Class 9
                </option>

                <option value="Class 10" ${selectedClass==="Class 10"?"selected":""}>
                    Class 10
                </option>

            </select>

            <br><br>

            <button onclick="registerStudent()">
                ✅ Register
            </button>

            <br><br>

            <button onclick="goHome()">
                ⬅ Cancel
            </button>

        </div>

    `;
}

// -----------------------------
// Register Student
// -----------------------------

function registerStudent() {

    const name =
        document.getElementById("studentName").value.trim();

    const mobile =
        document.getElementById("studentMobile").value.trim();

    const studentClass =
        document.getElementById("studentClass").value;

    if (name === "" || mobile === "" || studentClass === "") {

        alert("Please fill all fields.");

        return;
    }

    const student = {

        id: generateStudentID(),

        name: name,

        mobile: mobile,

        studentClass: studentClass,

        joined: new Date().toLocaleDateString()

    };

    saveStudent(student);

    alert(
        "Registration Successful!\n\nStudent ID : " +
        student.id
    );

    showClassDashboard(studentClass);

}

// ======================================================
// END OF PART 1
// ======================================================
// ======================================================
// PART 2
// Navigation
// ======================================================

// -----------------------------
// Class Dashboard
// -----------------------------

function showClassDashboard(className) {

    if (!getStudent()) {
        showRegistration(className);
        return;
    }

    document.querySelector(".container").innerHTML = `

        <div class="welcome-card">

            <h2>${className}</h2>

            <p>Select a Subject</p>

            <button onclick="showSubject('${className}','Mathematics')">
                📘 Mathematics
            </button>

            <button onclick="showSubject('${className}','Science')">
                🔬 Science
            </button>

            <button onclick="showSubject('${className}','Social Science')">
                🌍 Social Science
            </button>

            <button onclick="showSubject('${className}','English')">
                📖 English
            </button>

            <button onclick="showSubject('${className}','Hindi')">
                📝 Hindi
            </button>

            <br><br>

            <button onclick="goHome()">
                ⬅ Back
            </button>

        </div>

    `;
}

// -----------------------------
// Subject Screen
// -----------------------------

function showSubject(className, subject) {

    document.querySelector(".container").innerHTML = `

        <div class="welcome-card">

            <h2>${className}</h2>

            <h3>${subject}</h3>

            <button onclick="typeQuestion('${className}','${subject}')">
                🤖 Ask AI
            </button>

            <br><br>

            <button onclick="showClassDashboard('${className}')">
                ⬅ Back
            </button>

        </div>

    `;
}

// -----------------------------
// Question Screen
// -----------------------------

function typeQuestion(className, subject) {

    document.querySelector(".container").innerHTML = `

        <div class="welcome-card">

            <h2>${className}</h2>

            <h3>${subject}</h3>

            <textarea
                id="question"
                rows="8"
                placeholder="Type your homework question here..."></textarea>

            <br><br>

            <button onclick="submitQuestion('${className}','${subject}')">
                🚀 Submit
            </button>

            <br><br>

            <button onclick="showSubject('${className}','${subject}')">
                ⬅ Back
            </button>

        </div>

    `;
}

// -----------------------------
// Home Buttons
// -----------------------------

document.getElementById("class6").onclick = function () {
    showClassDashboard("Class 6");
};

document.getElementById("class7").onclick = function () {
    showClassDashboard("Class 7");
};

document.getElementById("class8").onclick = function () {
    showClassDashboard("Class 8");
};

document.getElementById("class9").onclick = function () {
    showClassDashboard("Class 9");
};

document.getElementById("class10").onclick = function () {
    showClassDashboard("Class 10");
};

// ======================================================
// END OF PART 2
// ======================================================
// ======================================================
// PART 3
// AI Question & Answer
// ======================================================

// -----------------------------
// Submit Question
// -----------------------------

async function submitQuestion(className, subject) {

    const question = document.getElementById("question").value.trim();

    if (question === "") {

        alert("Please enter your homework question.");

        return;
    }

    document.querySelector(".container").innerHTML = `

        <div class="welcome-card">

            <h2>⏳ Thinking...</h2>

            <p>Please wait while AI prepares your answer.</p>

        </div>

    `;

    try {

        
const data = await askAI(className, subject, question);
        const answer =
            data.answer || "Sorry, no answer was received.";

        const formattedAnswer = answer
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");
        
        document.querySelector(".container").innerHTML = `

            <div class="welcome-card">

                <h2>${className}</h2>

                <h3>${subject}</h3>

                <hr>

                <h3>Your Question</h3>

                <div class="answer-card">

                    ${question}

                </div>

                <br>

                <h3>🤖 AI Answer</h3>

                <div class="answer-card">

                    ${formattedAnswer}

                </div>

                <br><br>

                <button onclick="typeQuestion('${className}','${subject}')">

                    Ask Another Question

                </button>

                <br><br>

                <button onclick="showSubject('${className}','${subject}')">

                    ⬅ Back

                </button>

            </div>

        `;

    }

    catch(error) {

        console.error(error);

        document.querySelector(".container").innerHTML = `

            <div class="welcome-card">

                <h2>❌ Error</h2>

                <p>Unable to contact AI.</p>

                <p>${error.message}</p>

                <br><br>

                <button onclick="typeQuestion('${className}','${subject}')">

                    Try Again

                </button>

                <br><br>

                <button onclick="showSubject('${className}','${subject}')">

                    ⬅ Back

                </button>

            </div>

        `;

    }

}

// ======================================================
// END OF PART 3
// ======================================================
