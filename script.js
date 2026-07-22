   // ======================================================
// CBSE Homework AI - script.js
// Completely Free & Client-Side Flow
// ======================================================

// -----------------------------
// CONFIGURATION
// -----------------------------
const TRIAL_DAYS = 7;
const TRIAL_QUESTIONS = 30;

// 🔗 REPLACE THESE TWO LINKS WITH YOUR ACTUAL GOOGLE FORM LINKS
const GOOGLE_FORM_REGISTRATION_URL = "https://docs.google.com/forms/d/e/YOUR_REGISTRATION_FORM_ID/viewform";
const GOOGLE_FORM_PAYMENT_URL = "https://docs.google.com/forms/d/e/YOUR_PAYMENT_FORM_ID/viewform";

// 💳 REPLACE WITH YOUR UPI ID (e.g., yourname@upi or mobile@paytm)
const YOUR_UPI_ID = "yourupiid@upi"; 

// -----------------------------
// TRIAL & COUNTER MANAGEMENT
// -----------------------------

function startFreeTrial() {
    if (!localStorage.getItem("trialStart")) {
        localStorage.setItem("trialStart", Date.now());
        localStorage.setItem("questionCount", "0");
    }
}

function checkTrialStatus() {
    const trialStart = Number(localStorage.getItem("trialStart"));
    const questionCount = Number(localStorage.getItem("questionCount") || 0);

    // If user hasn't started trial yet, auto-start on first class access
    if (!trialStart) {
        startFreeTrial();
        return { allowed: true, remaining: TRIAL_QUESTIONS, used: 0 };
    }

    const daysPassed = (Date.now() - trialStart) / (1000 * 60 * 60 * 24);

    if (daysPassed >= TRIAL_DAYS) {
        return {
            allowed: false,
            reason: "Your 7-Day FREE Trial has ended."
        };
    }

    if (questionCount >= TRIAL_QUESTIONS) {
        return {
            allowed: false,
            reason: "You have completed all 30 FREE questions."
        };
    }

    return {
        allowed: true,
        remaining: TRIAL_QUESTIONS - questionCount,
        used: questionCount
    };
}

function increaseQuestionCount() {
    let count = Number(localStorage.getItem("questionCount") || 0);
    count++;
    localStorage.setItem("questionCount", count);
    return count;
}

// -----------------------------
// PAYMENT & PAYWALL MODAL
// -----------------------------

function showPaywallModal(reasonMessage) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${YOUR_UPI_ID}&pn=CBSE_Homework_AI&am=199&cu=INR`;
    
    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2 style="color: #e74c3c;">🔒 Trial Limit Reached</h2>
            <p><b>${reasonMessage}</b></p>
            <hr>
            <h3>Upgrade to Unlimited Access</h3>
            <p style="font-size: 14px; color: #555;">Scan with GPay, PhonePe, or Paytm to pay <b>₹199 / month</b>:</p>
            
            <img src="${qrUrl}" alt="UPI QR Code" style="width:180px; height:180px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px;">

            <p style="font-size: 12px; color: #777;">After scanning and paying, click below to confirm:</p>
            
            <a href="${GOOGLE_FORM_PAYMENT_URL}" target="_blank" style="display:inline-block; background:#27ae60; color:#fff; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:bold; margin-top:5px;">
                ✅ Submit Payment Reference
            </a>
            <br><br>
            <button onclick="goHome()">⬅ Back to Home</button>
        </div>
    `;
}

// -----------------------------
// NAVIGATION & REGISTRATION
// -----------------------------

function goHome() {
    location.reload();
}

// Entry point button redirect to Google Form Registration
function startRegistration() {
    window.location.href = GOOGLE_FORM_REGISTRATION_URL;
}

// -----------------------------
// CLASS DASHBOARD
// -----------------------------

function showClassDashboard(className) {
    const trial = checkTrialStatus();

    if (!trial.allowed) {
        showPaywallModal(trial.reason);
        return;
    }

    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>${className}</h2>
            <p style="background:#f1f1f1; padding:6px; border-radius:4px; font-weight:bold;">
                📊 Questions Used: ${trial.used} / ${TRIAL_QUESTIONS}
            </p>
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

            <button onclick="typeQuestion('${className}','${subject}')">🤖 Ask AI</button>
            <br><br>
            <button onclick="showClassDashboard('${className}')">⬅ Back</button>
        </div>
    `;
}

// -----------------------------
// QUESTION INPUT HUB (TYPE / VOICE / OCR)
// -----------------------------

function typeQuestion(className, subject) {
    const trial = checkTrialStatus();

    if (!trial.allowed) {
        showPaywallModal(trial.reason);
        return;
    }

    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>${className} - ${subject}</h2>
            <p style="font-size:13px; color:#666;">Questions Used: <b>${trial.used} / ${TRIAL_QUESTIONS}</b></p>
            
            <textarea id="question" rows="6" placeholder="Type your homework question here..."></textarea>
            <br><br>

            <!-- Input Options -->
            <button onclick="startVoiceInput()" style="background:#007bff; color:#fff;">🎙️ Voice Input</button>
            <button onclick="triggerOCRScan()" style="background:#17a2b8; color:#fff;">📷 OCR Image Scan</button>
            <input type="file" id="ocrFileInput" accept="image/*" style="display:none;" onchange="handleOCRImage(event)">

            <br><br>
            <button onclick="submitQuestion('${className}','${subject}')" style="background:#28a745; color:#fff; width:100%;">🚀 Submit Question</button>

            <br><br>
            <button onclick="showSubject('${className}','${subject}')">⬅ Back</button>
        </div>
    `;
}

// --- Voice Recognition Feature (Web Speech API) ---
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Voice recognition is not supported on this browser. Please type your question.");
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Default to Indian accent/English
    
    alert("Listening... Speak your question clearly into your microphone.");
    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("question").value = transcript;
    };

    recognition.onerror = function() {
        alert("Could not process voice input. Please try speaking again or type your question.");
    };
}

// --- OCR Scanner Handler (Zero-Cost Setup) ---
function triggerOCRScan() {
    document.getElementById("ocrFileInput").click();
}

// ---------- OCR Image Handler ----------
let selectedImageBase64 = "";

function handleOCRImage(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {

        selectedImageBase64 = e.target.result;

        alert("✅ Homework image selected successfully.\n\nNow press 🚀 Submit Question.");
    };

    reader.readAsDataURL(file);
}
// -----------------------------
// SUBMIT QUESTION & AI ANSWER
// -----------------------------

async function submitQuestion(className, subject) {
    
const question =
document.getElementById("question").value.trim();
const image = selectedImageBase64;
   
 if (question === "" && image === "") {   {
        alert("Please enter or record a question.");
        return;
    }

    const trial = checkTrialStatus();
    if (!trial.allowed) {
        showPaywallModal(trial.reason);
        return;
    }

    // Lock Premium Feature Check (Visuals Blocked in Trial)
    const needsVisuals = /diagram|image|draw|picture|figure/i.test(question);
    if (needsVisuals) {
        alert("🔒 Visual explanations & diagrams are locked in the Standard Trial! Upgrade to Premium to request visual explanations.");
    }

    // Increment Question Count
    const currentCount = increaseQuestionCount();

    document.querySelector(".container").innerHTML = `
        <div class="welcome-card">
            <h2>⏳ AI is thinking...</h2>
            <p>Processing question ${currentCount} of 30...</p>
        </div>
    `;

    try {
        // AI Fetch call
        const data = await askAI(className, subject, question);
        const answer = data.answer || "Sorry, no answer was received.";

        const formattedAnswer = answer
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/\n/g, "<br>");

        document.querySelector(".container").innerHTML = `
            <div class="welcome-card">
                <h2>${className} (${subject})</h2>
                <p style="font-size:12px; color:#555;">Used Questions: <b>${currentCount} / ${TRIAL_QUESTIONS}</b></p>
                <hr>

                <h3>Your Question:</h3>
                <div class="answer-card" style="background:#f9f9f9; padding:10px; border-radius:5px;">
                    ${question}
                </div>

                <h3>🤖 AI Answer:</h3>
                <div class="answer-card" style="background:#f0f8ff; padding:10px; border-radius:5px; text-align:left;">
                    ${formattedAnswer}
                </div>

                <br>
                <button onclick="typeQuestion('${className}','${subject}')">Ask Another Question</button>
                <br><br>
                <button onclick="showSubject('${className}','${subject}')">⬅ Back</button>
            </div>
        `;
    } catch (error) {
        console.error(error);
        document.querySelector(".container").innerHTML = `
            <div class="welcome-card">
                <h2>❌ Error</h2>
                <p>Unable to connect to AI.</p>
                <p>${error.message}</p>
                <br>
                <button onclick="typeQuestion('${className}','${subject}')">Try Again</button>
            </div>
        `;
    }
}

// -----------------------------
// INITIAL BINDINGS FOR HOME BUTTONS
// -----------------------------

document.addEventListener("DOMContentLoaded", function() {
    const classes = ["class6", "class7", "class8", "class9", "class10"];
    classes.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.onclick = function() {
                const className = "Class " + id.replace("class", "");
                showClassDashboard(className);
            };
        }
    });
});
                     
