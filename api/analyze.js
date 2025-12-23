
export const config = {
    runtime: 'nodejs',
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { title, description } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Missing API Key' });
        }

        // Using "Gemini 2.0 Flash 001" which is confirmed available in your list
        const modelName = 'gemini-2.0-flash-001';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const prompt = `
        Analyze this DIY project and provide a difficulty rating.
        Project: ${title}
        Details: ${description || 'No details provided'}

        Return ONLY a JSON object with:
        - difficulty: "Trivial" | "Easy" | "Medium" | "Tricky" | "Hard" | "Sweaty" | "Expert" | "Legendary"
        - reasoning: A short, witty, 1-sentence explanation.
        - confidence: A number between 0 and 1.
        `;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini REST API Error:", errorText);
            throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        // Extract text
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return res.status(200).json(JSON.parse(cleanText));

    } catch (error) {
        console.error("Handler Error:", error);
        return res.status(500).json({
            error: error.message,
            details: error.toString()
        });
    }
}
