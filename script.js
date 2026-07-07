function showClassDashboard(className) {
    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>${className}</h2>
            <p>Select a Subject</p>

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

function typeQuestion(className, subject) {
    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>${className} - ${subject}</h2>

            <textarea id="question"
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





function goHome() {
    location.reload();
}

document.getElementById("class6").onclick = () => showClassDashboard("Class 6");
document.getElementById("class7").onclick = () => showClassDashboard("Class 7");
document.getElementById("class8").onclick = () => showClassDashboard("Class 8");
document.getElementById("class9").onclick = () => showClassDashboard("Class 9");
document.getElementById("class10").onclick = () => showClassDashboard("Class 10");