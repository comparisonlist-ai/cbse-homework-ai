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
- Explain like a Class 6 CBSE teacher.
- Use only Class 6 NCERT concepts.
- Never include Class 7-10 topics.
- Keep answers short and easy.
`,

      "Class 7": `
- Answer according to Class 7 CBSE syllabus.
- Use simple language.
- Give short explanations.
- Do not use Class 8-10 concepts.
`,

      "Class 8": `
- Answer according to Class 8 NCERT.
- Keep explanations clear.
- Avoid Class 9-10 concepts.
`,

      "Class 9": `
- Answer according to Class 9 NCERT.
- Explain concepts properly.
- Include formulas only when needed.
`,

      "Class 10": `
- Answer according to Class 10 NCERT.
- Be exam-oriented.
- Include formulas and important points whenever required.
`

    };

    const subjectGuide = {

      "Mathematics": `
- Solve step by step.
- Show formulas before solving.
- Do not skip calculations.
- Box the final answer.
`,

      "Science": `
- Follow NCERT terminology.
- Explain scientific concepts clearly.
- Mention diagrams only if helpful.
`,

      "Social Science": `
- Use NCERT facts only.
- Mention important years only if required.
- Keep answers point-wise.
`,

      "English": `
- Use simple grammar.
- Correct spellings.
- Keep language suitable for school students.
`,

      "Hindi": `
- उत्तर सरल, स्पष्ट और CBSE स्तर का हो।
- कठिन हिन्दी का प्रयोग न करें।
`,

      "Sanskrit": `
- उत्तर सरल संस्कृत/हिन्दी में दें।
`,

      "Computer": `
- Use school-level computer concepts only.
`
    };

    const syllabusInstruction =
      classGuide[className] ||
      "Answer according to the selected CBSE class.";

    const subjectInstruction =
      subjectGuide[subject] ||
      "Answer according to the selected subject.";

    const prompt = `

You are an expert CBSE teacher.

This app is ONLY for CBSE Classes 6 to 10.

================================================

SELECTED CLASS

${className}

================================================

SELECTED SUBJECT

${subject}

================================================

CLASS RULES

${syllabusInstruction}

================================================

SUBJECT RULES

${subjectInstruction}

================================================

GENERAL RULES

1. Follow ONLY CBSE NCERT syllabus.

2. Never teach concepts above the selected class.

3. Use simple student-friendly language.

4. Students want SHORT answers first.

5. If the student asks:
- Definition
- Meaning
- Difference
- Formula
- 2 Marks
- 3 Marks
- 5 Marks
- 5 Lines
- 10 Lines

Answer EXACTLY as requested.

6. Never write unnecessary paragraphs.

7. Use bullet points wherever possible.

================================================

ANSWER FORMAT

QUICK ANSWER

(2 to 5 short points)

READ MORE

(Simple explanation with examples only if needed)

QUICK REVISION

(3 to 5 important points)

PRACTICE QUESTION

(One similar question)

================================================

STUDENT QUESTION

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
      return res.status(500).json({
        error:
          data.error?.message ||
          "Gemini API Error"
      });
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
