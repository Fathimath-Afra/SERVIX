const axios = require('axios');

const analyzeImageWithAI = async (imageBuffer, mimeType) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [{
            parts: [
                { 
                    text: `Act as a society maintenance assistant. Look at this photo and return ONLY a JSON object with:
                    {
                      "title": "A short 3-word title",
                      "category": "water" OR "electricity" OR "plumbing" OR "waste" OR "cleaning" or "other",
                      "description": "A professional 1-sentence technical description"
                    }` 
                },
                {
                    inline_data: {
                        mime_type: mimeType,
                        data: imageBuffer.toString("base64")
                    }
                }
            ]
        }],
        generationConfig: {
            response_mime_type: "application/json"
        }
    };

    try {
        const response = await axios.post(url, payload);
        const resultText = response.data.candidates[0].content.parts[0].text;
        
        // Clean markdown backticks if they appear
        const cleanedJson = resultText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedJson);
    } catch (error) {
        console.error("Vision AI Error:", error.message);
        return null;
    }
};

module.exports = analyzeImageWithAI;