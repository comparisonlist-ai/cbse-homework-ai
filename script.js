function showClassDashboard(className) {
    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>${className}</h2>
            <p>Choose a Subject</p>

            <button onclick="showSubject('${className}','Mathematics')">📘 Mathematics</button>
            <button onclick="showSubject('${className}','Science')">🔬 Science</button>
            <button onclick="showSubject('${className}','Social Science')">🌍 Social Science</button>
            <button onclick="showSubject('${className}','English')">📖 English</button>
            <button onclick="showSubject('${className}','Hindi')">📝 Hindi</button>

            <br><br>

            <button onclick="goHome()">⬅ Back</button>
        </div>
    `;
}

function showSubject(className, subject) {
    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>${className}</h2>
            <h3>${subject}</h3>

            <button>📷 Scan Homework</button>

            <button onclick="typeQuestion('${className}','${subject}')">
                ✍️ Type Question
            </button>

            <button>🤖 Ask AI</button>

            <button>📚 NCERT Solutions</button>

            <br><br>

            <button onclick="showClassDashboard('${className}')">
                ⬅ Back
            </button>
        </div>
    `;
}

function typeQuestion(className, subject) {
    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>${className} - ${subject}</h2>

            <p>Type your homework question below:</p>

            <textarea id="question"
                style="width:100%;height:150px;padding:10px;"
                placeholder="Type your question here..."></textarea>

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

function submitQuestion(className, subject) {

    const question = document.getElementById("question").value.trim();

    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">

            <h2>🤖 CBSE Homework AI</h2>

            <h3>Thinking...</h3>

            <p>⏳ Please wait while AI is preparing your answer.</p>

        </div>
    `;

    setTimeout(function () {

        let answer = "Sorry! AI answer is not available for this question yet.";

        if (question.toLowerCase().includes("pythagoras")) {
            answer = `
<b>Pythagoras Theorem</b><br><br>

In a right-angled triangle:<br><br>

<b>Hypotenuse² = Base² + Perpendicular²</b><br><br>

Formula:<br>

<b>c² = a² + b²</b><br><br>

Example:<br><br>

Base = 3 cm<br>
Perpendicular = 4 cm<br><br>

c² = 3² + 4² = 25<br>

c = 5 cm<br><br>

<b>Answer: Hypotenuse = 5 cm</b>
`;
        }

        document.querySelector(".container").innerHTML = `
            <div class="welcome-card">

                <h2>🤖 CBSE Homework AI</h2>

                <h3>${className} - ${subject}</h3>

                <hr>

                <h3>Your Question</h3>

                <p>${question}</p>

                <hr>

                <h3>AI Answer</h3>

                <div id="answerText">${answer}</div>

                <br>

                <button onclick="copyAnswer()">📋 Copy Answer</button>

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

    }, 2000);

}



function copyAnswer() {

    const text = document.getElementById("answerText").innerText;

    navigator.clipboard.writeText(text)
        .then(() => alert("✅ Answer copied successfully!"))
        .catch(() => alert("❌ Copy not supported on this device."));
}

function goHome() {
    location.reload();
}

document.getElementById("class6").onclick = () => showClassDashboard("Class 6");
document.getElementById("class7").onclick = () => showClassDashboard("Class 7");
document.getElementById("class8").onclick = () => showClassDashboard("Class 8");
document.getElementById("class9").onclick = () => showClassDashboard("Class 9");
document.getElementById("class10").onclick = () => showClassDashboard("Class 10");