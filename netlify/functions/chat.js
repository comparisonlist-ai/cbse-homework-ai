
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const { question } = JSON.parse(event.body);
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:          
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
...

Solution:
Step 1:
Step 2:
Step 3:

Final Answer:
...

Rules:
1. Use only plain text.
2. Do NOT use Markdown.
3. Do NOT use LaTeX.
4. Keep the answer suitable for Class 6–10 students.
5. Keep the explanation short and clear.

Student's Question:
${question}`
        }
      ]
    }
  ]
})
Always answer in this exact format:

Concept:
...

Formula:
...

Given:
...

Solution:
Step 1:
Step 2:
Step 3:

Final Answer:
...

Rules:
1. Use only plain text.
2. Do NOT use Markdown.
3. Do NOT use LaTeX.
4. Keep the answer suitable for Class 6–10 students.
5. Keep the explanation short and clear.

Student's Question:
${question}
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  console.log(JSON.stringify(data, null, 2));
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
};
