async function askAI(className, subject, question) {
    const response = await fetch(SETTINGS.API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            className,
            subject,
            question
        })
    });

    if (!response.ok) {
        throw new Error("Server Error");
    }

    return await response.json();
}

// Make it available to script.js
window.askAI = askAI;
