export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405
      });
    }

    try {

      const { className, subject, question } = await request.json();

      const apiKey = env.GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set.");
      }

      const prompt = `You are an expert CBSE NCERT teacher.

Student Details:
Class: ${className}
Subject: ${subject}

Student Question:
${question}

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

      return new Response(
        JSON.stringify({ answer }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          answer: "Server Error",
          error: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }
};
