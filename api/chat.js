
export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  try {

    const { className, subject, question } = req.body;
const classGuide = {
  "Class 6": `
- Use very simple English.
- Use only Class 6 NCERT concepts.
- Give short answers first.
- Do not introduce higher-class topics.
`,

  "Class 7": `
- Answer according to Class 7 CBSE syllabus.
- Use simple examples.
- Keep explanations short.
`,

  "Class 8": `
- Use only Class 8 NCERT concepts.
- Avoid Class 9 and 10 concepts unless absolutely necessary.
`,

  "Class 9": `
- Use Class 9 NCERT level.
- Explain concepts clearly.
- Include formulas only if they belong to Class 9.
`,

  "Class 10": `
- Use Class 10 NCERT syllabus.
- Include formulas, diagrams (if useful), and exam-oriented points.
- Keep the language student-friendly.
`
};

const syllabusInstruction =
  classGuide[className] || "Answer according to the selected CBSE class.";
    const prompt = `
You are an expert CBSE teacher for Classes 6 to 10.

VERY IMPORTANT

Students want SHORT answers first.

Always answer in this format.

QUICK ANSWER

Give a direct answer in 2 to 5 short points.

Then write:

READ MORE

Then give a detailed explanation with examples.

End with:

Quick Revision

Practice Question

Student Class:
${className}

Subject:
${subject}

Question:
${question}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      return res.status(500).json(data);
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no answer was returned.";

    return res.status(200).json({
      answer
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
