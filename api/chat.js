// ======================================================
// Students Homework AI
// api/chat.js
// Version 4.0
// BATCH 1
// Production Ready
// ======================================================

const GEMINI_API_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// ------------------------------------------------------
// MAIN HANDLER
// ------------------------------------------------------

export default async function handler(req, res) {

    // -----------------------------
    // CORS
    // -----------------------------

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // -----------------------------
    // PREFLIGHT
    // -----------------------------

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }

    // -----------------------------
    // ONLY POST
    // -----------------------------

    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            error: "Method Not Allowed"

        });

    }

    // -----------------------------
    // API KEY
    // -----------------------------

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {

        return res.status(500).json({

            success: false,

            error: "Gemini API Key is missing."

        });

    }

    try {

        // -----------------------------
        // REQUEST DATA
        // -----------------------------

        const {

            className,
            subject,
            language,
            question

        } = req.body || {};

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!question || question.trim() === "") {

            return res.status(400).json({

                success: false,

                error: "Question is required."

            });

        }

        if (!className) {

            return res.status(400).json({

                success: false,

                error: "Class is required."

            });

        }

        if (!subject) {

            return res.status(400).json({

                success: false,

                error: "Subject is required."

            });

        }

        const answerLanguage =

            language === "Hindi"
                ? "Hindi"
                : "English";

        // -----------------------------
        // NORMALIZE INPUT
        // -----------------------------

        const cleanQuestion =
            question.trim();

        const cleanClass =
            String(className).trim();

        const cleanSubject =
            String(subject).trim();

        // -------------------------------------------------
        // CONTINUE IN BATCH 2
        // -------------------------------------------------

            // -------------------------------------------------
        // BATCH 2
        // CBSE-NCERT PROMPT ENGINE
        // -------------------------------------------------

        const systemPrompt = `
You are Students Homework AI.

You are an expert CBSE and NCERT teacher.

Your job is to help students of CBSE Classes 6–10 only.

Follow these rules strictly.

1. Answer ONLY according to the latest NCERT-CBSE syllabus.

2. Use Class "${cleanClass}" syllabus.

3. Subject is "${cleanSubject}".

4. Language must be ${answerLanguage}.

5. Give the DIRECT ANSWER first.

6. Keep the answer concise, clear and exam-oriented.

7. Do NOT behave like a general AI chatbot.

8. Never say:
"As an AI..."
"I think..."
"I believe..."
"According to my knowledge..."

9. Never generate unnecessary illustrations,
ASCII art,
decorative diagrams,
emoji decorations,
or long introductions.

10. Use headings only when required.

11. Use tables only if they genuinely improve understanding.

12. Mathematical answers must show proper steps.

13. Science answers should follow NCERT terminology.

14. English answers should use correct grammar and CBSE style.

15. Hindi answers should use simple school-level Hindi.

16. If the question is outside the CBSE syllabus,
politely mention that it is outside the current syllabus.

17. If additional explanation would help,
add it ONLY under the heading:

## Learn More

The student can choose to read it.

Do NOT force lengthy explanations before the direct answer.

Return clean Markdown only.
`;

        // -------------------------------------------------
        // USER PROMPT
        // -------------------------------------------------

        const userPrompt = `
Class : ${cleanClass}

Subject : ${cleanSubject}

Language : ${answerLanguage}

Question :

${cleanQuestion}
`;

        // -------------------------------------------------
        // GEMINI REQUEST BODY
        // -------------------------------------------------

        const requestBody = {

            contents: [

                {

                    role: "user",

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

                temperature: 0.3,

                topP: 0.9,

                topK: 32,

                maxOutputTokens: 2048

            }

        };

        // -------------------------------------------------
        // GEMINI API CALL
        // -------------------------------------------------

        const response = await fetch(

            `${GEMINI_API_URL}?key=${API_KEY}`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(
                    requestBody
                )

            }

        );

        if (!response.ok) {

            throw new Error(
                "Gemini API request failed."
            );

        }

        const geminiResult =
            await response.json();

        // -------------------------------------------------
        // CONTINUE IN BATCH 3
        // -------------------------------------------------
        // -------------------------------------------------
        // BATCH 3
        // RESPONSE EXTRACTION & FORMATTING
        // -------------------------------------------------

        let answer = "";

        try {

            answer =
                geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        } catch (error) {

            answer = "";

        }

        if (!answer) {

            return res.status(500).json({

                success: false,

                error: "No answer received from AI."

            });

        }

        // -------------------------------------------------
        // CLEAN RESPONSE
        // -------------------------------------------------

        answer = answer

            .replace(/\r\n/g, "\n")

            .replace(/\r/g, "\n")

            .trim();

        // -------------------------------------------------
        // SPLIT "LEARN MORE"
        // -------------------------------------------------

        let mainAnswer = answer;

        let learnMore = "";

        const splitRegex =
            /(?:^|\n)#{1,3}\s*Learn\s*More\b/i;

        if (splitRegex.test(answer)) {

            const parts =
                answer.split(splitRegex);

            mainAnswer =
                parts[0].trim();

            learnMore =
                parts.slice(1).join("").trim();

        }

        // -------------------------------------------------
        // MARKDOWN TO HTML
        // -------------------------------------------------

        function markdownToHTML(text) {

            if (!text) return "";

            return text

                .replace(/\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>")

                .replace(/\*(.*?)\*/g,
                    "<em>$1</em>")

                .replace(/^### (.*)$/gm,
                    "<h3>$1</h3>")

                .replace(/^## (.*)$/gm,
                    "<h2>$1</h2>")

                .replace(/^# (.*)$/gm,
                    "<h1>$1</h1>")

                .replace(/^- (.*)$/gm,
                    "<li>$1</li>")

                .replace(/(<li>.*<\/li>)/gs,
                    "<ul>$1</ul>")

                .replace(/\n\n/g,
                    "<br><br>")

                .replace(/\n/g,
                    "<br>");

        }

        const mainHTML =
            markdownToHTML(mainAnswer);

        const learnHTML =
            markdownToHTML(learnMore);

        // -------------------------------------------------
        // FINAL HTML
        // -------------------------------------------------

        let finalHTML =

`<div class="cbse-answer">

${mainHTML}

</div>`;

        if (learnHTML) {

            finalHTML += `

<div class="learn-more">

<button
type="button"
onclick="toggleLearnMore()">

📖 Learn More

</button>

<div
id="learnMoreContent"
class="learn-more-content hidden">

${learnHTML}

</div>

</div>`;

        }

        // -------------------------------------------------
        // CONTINUE IN BATCH 4
        // -------------------------------------------------

        // -------------------------------------------------
        // BATCH 4
        // FINAL RESPONSE
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            answer: finalHTML,

            className: cleanClass,

            subject: cleanSubject,

            language: answerLanguage,

            timestamp: new Date().toISOString()

        });

    }

    // -------------------------------------------------
    // ERROR HANDLING
    // -------------------------------------------------

    catch (error) {

        console.error(

            "Students Homework AI Error:",

            error

        );

        return res.status(500).json({

            success: false,

            answer:
                "<h2>Unable to Generate Answer</h2>" +
                "<p>Please check your internet connection and try again.</p>",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal Server Error"

        });

    }

}

// ======================================================
// Version 4.0
// api/chat.js
// Production Ready
// ======================================================
        
    
