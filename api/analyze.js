
export const config = {
    runtime: 'nodejs',
};

export default async function handler(req, res) {
    // Allow GET or POST for this debug step

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Missing API Key' });
        }

        // DEBUG MODE: List available models
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        console.log("Fetching models list...");
        const response = await fetch(listUrl);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Failed to list models",
                details: data
            });
        }

        // Return the full list of models to the frontend
        return res.status(200).json({
            debug: "Listing available models",
            models: data.models || []
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            details: error.toString()
        });
    }
}
