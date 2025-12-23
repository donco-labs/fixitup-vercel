
import { GoogleGenerativeAI } from '@google/generative-ai';

// Run this locally with: GEMINI_API_KEY=your_key node check_models.js
// Or deploy as an API route temporarily

async function checkModels() {
    // Check if key is present
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("Error: GEMINI_API_KEY not found in environment.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        // We can't list models purely via the helper easily without a raw request sometimes, 
        // but let's try the simple model fetch first.

        // Actually, the easiest way to debug "What models do I have?" 
        // implies we might just want to use the most basic stable one: 'gemini-1.0-pro' 
        // OR simply print the error details more clearly if authorization fails.

        console.log("Testing Model: gemini-pro");
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-pro:", await result.response.text());

    } catch (error) {
        console.error("Error details:", error);
    }
}

// Since we are in Vercel/Node environment, we might not be able to run this easily from the terminal 
// without the key. 
// Instead, I will modify the API route to dump the list of errors or try a fallback.
