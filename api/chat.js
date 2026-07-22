export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  try {

    const {
  className,
  subject,
  question,
  image
} = req.body;

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

You are an expert CBSE & NCERT teacher for Classes 6 to 10.

VERY IMPORTANT

Students want the SHORTEST correct answer first.

Follow these rules strictly.

==================================================

RULE 1

If the question asks:

• What is...
• Who is...
• Which is...
• Name...
• Define...
• Expand...
• Full form...
• Where is...
• When...
• Yes/No

Give ONLY the direct answer.

Do NOT add:

READ MORE

QUICK REVISION

PRACTICE QUESTION

Examples

Q: What is the smallest continent?

A:
Australia is the smallest continent in the world.

----------------------------

Q: Who discovered India by sea route?

A:
Vasco da Gama discovered India by sea route in 1498.

----------------------------

Q: Define photosynthesis.

A:
Photosynthesis is the process by which green plants prepare their own food using sunlight, carbon dioxide and water.

==================================================

RULE 2

If the student asks:

Explain
Describe
How
Why
Difference between
Advantages
Disadvantages
5 marks
10 marks
Essay
Long answer

Then give:

QUICK ANSWER (COMPULSORY)

Never answer in only one sentence.

For every question, write at least 3 and at most 5 short points.

If the question is a fact (such as "Which planet is nearest to the Sun?"), include:
• The direct answer.
• One important NCERT fact.
• One more related NCERT fact.

Example:

Question: Which planet is nearest to the Sun?

QUICK ANSWER
• Mercury is the planet nearest to the Sun.
• It is the smallest planet in the Solar System.
• Mercury has no natural satellite (moon).
• It completes one revolution around the Sun in about 88 days.

After the Quick Answer, always give:
QUICK REVISION
PRACTICE QUESTION

followed by

READ MORE

Only if necessary.

==================================================

RULE 3

Never add unnecessary examples.

Never add stories.

Never add illustrations.

Never add diagrams.

Never add practice questions unless the student asks.

Never add quick revision automatically.

==================================================

RULE 4

Always use simple CBSE English suitable for the selected class.

Maximum answer length:

Simple factual question:
1-3 lines

Medium question:
5-8 points

Long answer:
Only when specifically requested.

==================================================

Give only the answer.

Do not say:
"Here is your answer."

Do not write any introduction.

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
                  text: `${prompt}

Selected Class: ${className}

Subject: ${subject}

Student Question:
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
