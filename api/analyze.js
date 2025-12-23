
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
    runtime: 'nodejs',
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { title, description } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing Gemini API Key in environment variables");
            return res.status(500).json({ error: 'Server Configuration Error: Missing API Key' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
        Analyze this DIY project and provide a difficulty rating.
        Project: ${title}
        Details: ${description || 'No details provided'}

        Return ONLY a JSON object with:
        - difficulty: "Trivial" | "Easy" | "Medium" | "Tricky" | "Hard" | "Sweaty" | "Expert" | "Legendary"
        - reasoning: A short, witty, 1-sentence explanation.
        - confidence: A number between 0 and 1.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        let text = response.text();
        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);

        return res.status(200).json(data);
    } catch (error) {
        console.error("AI Error Details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

        return res.status(500).json({
            error: error.message || 'An error occurred during AI analysis',
            details: error.toString()
        });
    }
}
