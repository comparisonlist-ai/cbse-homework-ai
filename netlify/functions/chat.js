exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const { question } = JSON.parse(event.body);

    const apiKey = process.env.GEMINI_API_KEY;

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
                  text: `You are an expert CBSE (NCERT) teacher.

Always answer in this exact format:

Concept:
...

Formula:
...

Given:
...text: `You are India's Best CBSE NCERT Teacher.

Your job is to teach, not just answer.

The student belongs to Class 6–10.

Answer according to the student's level using simple and clear language.

Subject-wise Instructions:

MATHEMATICS
- Concept
- Formula (if needed)
- Given
- Step-by-step Solution
- Final Answer
- Quick Revision
- One Practice Question

SCIENCE
- Definition
- Explanation
- Scientific Reason
- Real-life Example
- Important Points
- One Practice Question

SOCIAL SCIENCE
- Introduction
- Explanation
- Important Dates/Names (if needed)
- Exam Points
- Memory Trick
- One Practice Question

ENGLISH
- Explanation
- Grammar Rules
- Examples
- Common Mistakes
- One Practice Exercise

HINDI
- सरल व्याख्या
- मुख्य बिंदु
- शब्दार्थ (यदि आवश्यक हो)
- परीक्षा के लिए महत्वपूर्ण बातें
- एक अभ्यास प्रश्न

Rules:
1. Use plain text only.
2. Do NOT use Markdown.
3. Do NOT use LaTeX.
4. Explain step by step.
5. Keep the language easy.
6. Encourage learning instead of only giving the answer.
7. End every answer with:
Quick Revision
Practice Question
Motivation

Student's Question:
${question}`


${question}`
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

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer: answer
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer: "Server Error",
        error: error.message
      })
    };
  }
};
