
// =============================
// CBSE Homework AI
// Part 1
// Navigation & UI
// =============================

// Home Screen
function goHome() {
    location.reload();
}

// -----------------------------
// Class Dashboard
// -----------------------------
function showClassDashboard(className) {

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
                Submit
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
document.getElementById("class6").onclick = () => showClassDashboard("Class 6");
document.getElementById("class7").onclick = () => showClassDashboard("Class 7");
document.getElementById("class8").onclick = () => showClassDashboard("Class 8");
document.getElementById("class9").onclick = () => showClassDashboard("Class 9");
document.getElementById("class10").onclick = () => showClassDashboard("Class 10");

// submitQuestion() will be added in Part 2.






async function submitQuestion(className, subject) {

    const question = document.getElementById("question").value;

    if (!question.trim()) {
        alert("Please enter a question.");
        return;
    }

    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>⏳ Thinking...</h2>
            <p>Please wait while AI prepares the answer...</p>
        </div>
    `;

    try {

        const response = await fetch("/.netlify/functions/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                className: className,
                subject: subject,
                question: question
            })
        });

        const data = await response.json();

        const answer = data.answer || "Sorry, no answer was received.";

        document.querySelector(".container").innerHTML = `
            <div class="welcome-card">

                <h2>${className} - ${subject}</h2>

                <h3>Your Question</h3>

                <p>${question}</p>

                <h3>🤖 AI Answer</h3>

                <div class="answer-card">
                    ${answer.replace(/\n/g, "<br>")}
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

    } catch (error) {

        console.error(error);

        document.querySelector(".container").innerHTML = `
            <div class="welcome-card">

                <h2>❌ Error</h2>

                <p>Unable to contact AI.</p>

                <p>${error.message}</p>

                <br>

                <button onclick="typeQuestion('${className}','${subject}')">
                    Try Again
                </button>

            </div>
        `;

    }

}
