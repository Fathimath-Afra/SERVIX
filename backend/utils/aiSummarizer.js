const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAIResolution = async (title, workerNote) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a professional Residential Society Maintenance Assistant. 
            The worker just finished a task.
            Issue: ${title}
            Worker's Note: ${workerNote}

            Write a professional 2-sentence summary of the work done for the resident. 
            Also, provide one "Safety/Maintenance Tip" to prevent this in the future.
            Keep the tone polite and helpful. Format as HTML.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Error:", error);
        return `<p>The issue <b>${title}</b> has been resolved successfully.</p>`;
    }
};

module.exports = generateAIResolution;