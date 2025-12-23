
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
            console.error("Missing Gemini API Key");
            return res.status(500).json({ error: 'Missing API Key' });
        }

        // Direct REST API call to bypass library versioning issues
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

        // Extract text from the complex response structure
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
