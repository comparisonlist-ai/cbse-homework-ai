// ======================================================
// CBSE Homework AI
// script.js
// PART 1
// ======================================================

// -----------------------------
// Student Registration
// -----------------------------

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
