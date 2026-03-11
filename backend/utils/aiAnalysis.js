const axios = require('axios');

const generateMaintenanceInsights = async (dataSummary) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `
    You are an AI Property Consultant. Analyze this society maintenance data: 
    ${dataSummary}

    Identify:
    1. The most common technical failure category.
    2. Which specific location/block is most problematic.
    3. A proactive recommendation for the management committee.

    Return a JSON object: 
    { 
      "topIssue": "...", 
      "hotspot": "...", 
      "recommendation": "...",
      "urgencyScore": 1-10 
    }`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" }
        });

        // console.log(response.data);
        // console.log(process.env.GEMINI_API_KEY);
        return JSON.parse(response.data.candidates[0].content.parts[0].text);
    } catch (err) {
        // console.error("Gemini Error:", err.response?.data || err.message);
    return {
        topIssue: "Unknown",
        hotspot: "Unknown",
        recommendation: "AI unavailable",
        urgencyScore: 0
    };
    }
};

module.exports = generateMaintenanceInsights;