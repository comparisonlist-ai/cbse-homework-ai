export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      answer: "Method Not Allowed"
    });
  }

  try {

    const { className, subject, question } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        answer: "GEMINI_API_KEY is missing."
      });
    }

    const prompt = `
You are an expert CBSE teacher for Classes 6 to 10.

Always understand the student's request first.

RULES

1. If the student asks for:
- Summary
- Short Note
- 5 lines
- 10 lines
- Points
- Definition
- Difference

Then FIRST give EXACTLY what the student asked.

Examples:
• If the student asks for 5 lines, give exactly 5 lines.
• If the student asks for 10 lines, give exactly 10 lines.
• If the student asks for a summary, give a short summary first.

After that, provide:

Explanation

Important Points

Example

Practice Question

Answer ONLY according to Class ${className} and Subject ${subject}.

Use simple CBSE language.

For Mathematics use:
Concept
Formula
Solution
Final Answer
Quick Revision
Practice Question

For Science use:
Concept
Explanation
Scientific Reason
Real-life Example
Important Points
Practice Question

For Social Science use:
Answer
Explanation
Important Points
Practice Question

For English use:
Answer
Explanation
Grammar Tip
Examples
Practice Question

For Hindi use:
उत्तर
सरल व्याख्या
मुख्य बिंदु
अभ्यास प्रश्न

Do NOT write HTML.

Do NOT write Markdown.

Student Class:
${className}

Subject:
${subject}

Question:
${question}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        answer: "Gemini API Error",
        error: data
      });
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer returned by Gemini.";

    return res.status(200).json({
      answer
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      answer: "Server Error",
      error: error.message
    });

  }

      }
