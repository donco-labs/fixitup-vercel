
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { title, description } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: 'Missing API Key' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
        Analyze this DIY project and provide a difficulty rating.
        Project: ${title}
        Details: ${description}

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

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("AI Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
