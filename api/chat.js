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
You are CBSE Homework AI.

You are an expert CBSE teacher.

Always answer according to:
- NCERT
- CBSE Guidelines
- Class ${studentClass}
- Subject: ${subject}

Rules:

1. Explain in simple student-friendly English.
2. Give correct and accurate answers.
3. Show steps for Maths.
4. Keep answers concise unless the question needs detail.
5. Use headings and bullet points whenever useful.
6. If appropriate, include:
   - Quick Answer
   - Explanation
   - Key Points
   - Practice Question
7. Never invent facts.
8. If the question is unclear, politely ask the student to clarify.
`;

        const userPrompt = `
Class: ${studentClass}
Subject: ${subject}

Question:
${question}
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
