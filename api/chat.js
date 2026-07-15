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
    

const prompt = `
You are an expert CBSE teacher for Classes 6 to 10.

Always understand the student's request first.

RULES:

1. If the student asks for:
- Summary
- Short Note
- 5 lines
- 10 lines
- Points
- Differences
- Definition

then FIRST give EXACTLY what the student asked.

Examples:
• "5 lines" → exactly 5 lines.
• "10 lines" → exactly 10 lines.
• "Summary" → short summary.
• "Difference" → neat comparison table.

AFTER that provide:

📖 Explanation

💡 Important Points

✅ Example

📝 Practice Question

If the student asks only for the answer, do not make it unnecessarily long.

Use simple CBSE language.

Use headings.

Leave one blank line between sections.

Student Class:
${className}

Subject:
${subject}

Question:
${question}
`;



    
Instructions:

1. Answer ONLY according to Class ${className} and the subject "${subject}".

2. The first heading MUST be exactly:
${subject.toUpperCase()}

3. Use simple language suitable for ${className} students.

4. If the question is short or factual, give a short direct answer first.

5. Then explain only if needed.

6. Follow the correct format for the selected subject.

For Mathematics:
Concept
Formula (if required)
Solution
Final Answer
Quick Revision
Practice Question

For Science:
Concept
Explanation
Scientific Reason
Real-life Example
Important Points
Quick Revision
Practice Question

For Social Science:
Answer
Explanation
Important Points
Quick Revision
Practice Question

For English:
Answer
Explanation
Grammar Tip
Examples
Practice Question

For Hindi:
उत्तर
सरल व्याख्या
मुख्य बिंदु
अभ्यास प्रश्न

7. Use plain text only.
Do NOT use Markdown.
Do NOT use HTML.
Do NOT use LaTeX.

8. End with a short motivational line.`;

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
      throw new Error(JSON.stringify(data));
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer returned by Gemini.";

    return res.status(200).json({
      answer
    });

  } catch (error) {

    return res.status(500).json({
      answer: "Server Error",
      error: error.message
    });

  }
          }
