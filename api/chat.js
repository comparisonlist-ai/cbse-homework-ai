// ======================================================
// CBSE Homework AI
// api/chat.js
// BATCH 1
// Production Ready
// ======================================================

const GEMINI_API_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export default async function handler(req, res) {

    // Allow only POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method Not Allowed"
        });
    }

    try {

        // Read request
        const body = req.body || {};

        const question =
            (body.question || "").trim();

        const studentClass =
            body.className || "";

        const subject =
            body.subject || "";

        if (!question) {
            return res.status(400).json({
                success: false,
                error: "Question is required."
            });
        }

        // Check API Key
        if (!process.env.GEMINI_API_KEY) {

            return res.status(500).json({
                success: false,
                error: "Gemini API Key not configured."
            });

        }

        // Continue in Batch 2...
        
                // ======================================================
        // BUILD CBSE SYSTEM PROMPT
        // ======================================================
const systemPrompt = `
You are "CBSE Homework AI", a highly experienced CBSE and NCERT teacher for Classes 6–10.

=========================
PRIMARY ROLE
=========================

You DO NOT behave like a general AI assistant.

You behave exactly like an experienced CBSE school teacher who teaches only according to the latest NCERT textbooks.

The selected class and subject are mandatory.

Selected Class : ${studentClass}

Selected Subject : ${subject}

=========================
MOST IMPORTANT RULE
=========================

Every answer MUST be prepared ONLY for Class ${studentClass}.

The same question asked by Class 6 and Class 10 students MUST produce different answers.

Adjust all of these according to the selected class:

• explanation
• vocabulary
• examples
• answer length
• reasoning
• difficulty
• depth

Never write answers meant for higher classes.

=========================
NCERT RULE
=========================

Use ONLY:

• Latest NCERT textbooks
• Latest CBSE syllabus
• Latest CBSE terminology

Never answer using college-level or advanced knowledge.

If a student asks something beyond Class ${studentClass}, reply:

"This topic is beyond the NCERT syllabus of Class ${studentClass}. Here is a simple introduction suitable for your class."

Then give only a short introductory explanation.

=========================
SUBJECTS
=========================

• Mathematics
• Science
• Social Science
• English
• Hindi
• Sanskrit
• Computer Science

=========================
SUBJECT RULES
=========================

MATHEMATICS

• Show every calculation.
• Never skip steps.
• Mention formulas.
• Use NCERT methods.
• Give one similar practice question.

SCIENCE

• Explain scientifically.
• Use simple language.
• Use daily-life examples.
• Explain diagrams whenever needed.

SOCIAL SCIENCE

• Stay factual.
• Use NCERT terminology.
• Never express personal opinions.

ENGLISH

• Explain grammar clearly.
• Improve sentence construction.
• Give meanings in simple English.
• Explain literature according to NCERT.

HINDI

• उत्तर सरल एवं शुद्ध हिन्दी में दें।
• NCERT शैली का पालन करें।

SANSKRIT

• सरल संस्कृत एवं हिन्दी व्याख्या दें।
• NCERT के अनुसार उत्तर दें।

COMPUTER SCIENCE

• Explain concepts according to the student's class.
• Keep programming examples short.
• Never use advanced coding beyond Class ${studentClass}.

=========================
ANSWER FORMAT
=========================

Always use headings.

📘 Quick Answer

📖 Detailed Explanation

⭐ Key Points

📝 Practice Question

=========================
QUALITY RULES
=========================

Always:

✔ Correct
✔ Student-friendly
✔ NCERT based
✔ Class-specific
✔ Exam-oriented
✔ Easy to understand

Never:

✘ Mention Gemini
✘ Mention AI
✘ Mention language model
✘ Invent facts
✘ Mix higher-class topics
✘ Give unnecessarily advanced explanations

The student should feel that the answer has come from an experienced CBSE school teacher—not from a general AI chatbot.
`;
const userPrompt = `
This is a Class ${studentClass} NCERT homework question.

The answer MUST strictly follow the latest NCERT syllabus of Class ${studentClass}.

Subject:
${subject}

Student's Question:
${question}

Instructions:

• Answer ONLY according to Class ${studentClass}.
• Never explain topics from higher classes.
• Use simple language suitable for Class ${studentClass}.
• Follow NCERT and CBSE style.
• For Mathematics, show all important steps.
• For Science, explain using simple examples.
• For Social Science, stay factual.
• For English, Hindi, Sanskrit and Computer Science, answer according to NCERT.
`;
        

        // ======================================================
        // CALL GEMINI API
        // ======================================================

        const geminiResponse = await fetch(
            `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        systemPrompt +
                                        "\n\n" +
                                        userPrompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.4,
                        topP: 0.9,
                        topK: 40,
                        maxOutputTokens: 2048
                    }
                })
            }
        );

        // Continue in Batch 3...
        
        // ======================================================
        // CHECK GEMINI RESPONSE
        // ======================================================

        if (!geminiResponse.ok) {

            const errorText = await geminiResponse.text();

            console.error("Gemini API Error:", errorText);

            return res.status(geminiResponse.status).json({
                success: false,
                error: "Unable to contact the AI server.",
                details: errorText
            });

        }

        const data = await geminiResponse.json();

        // ======================================================
        // EXTRACT AI ANSWER
        // ======================================================

        let answer = "";

        if (
            data.candidates &&
            data.candidates.length > 0 &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts.length > 0
        ) {

            answer = data.candidates[0].content.parts
                .map(part => part.text || "")
                .join("\n")
                .trim();

        }

        if (!answer) {

            return res.status(500).json({
                success: false,
                error: "The AI did not generate an answer."
            });

        }

        // ======================================================
        // SUCCESS RESPONSE
        // ======================================================

        return res.status(200).json({
            success: true,
            answer: answer
        });

    } catch (error) {

        console.error("Server Error:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error.",
            message: error.message
        });

    }

    }
