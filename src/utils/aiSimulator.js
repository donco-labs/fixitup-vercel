export const assessProjectVisibility = async (title, description) => {
    // Simulate network delay to make it feel "real"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const text = (title + ' ' + description).toLowerCase();

    // Heuristic rules to mock AI analysis
    let data = {
        difficulty: 'Easy',
        reasoning: "Based on the description, this appears to be a routine maintenance task perfect for beginners.",
        confidence: 0.95
    };

    // Expert keywords
    if (text.includes('rewire') || text.includes('foundation') || text.includes('structural') || text.includes('panel') || text.includes('roof')) {
        data = {
            difficulty: 'Expert',
            reasoning: "This involves critical structural or electrical systems. High risk and requires specialized knowledge.",
            confidence: 0.85
        };
    }
    // Hard keywords
    else if (text.includes('install') || text.includes('replace') || text.includes('plumbing') || text.includes('wiring') || text.includes('tile')) {
        data = {
            difficulty: 'Hard',
            reasoning: "Requires specific tools and multi-step execution. Significant effort detected.",
            confidence: 0.90
        };
    }
    // Medium keywords
    else if (text.includes('repair') || text.includes('fix') || text.includes('patch') || text.includes('paint') || text.includes('assemble')) {
        data = {
            difficulty: 'Medium',
            reasoning: "Standard repair task. Requires some skill but has low risk of catastrophic failure.",
            confidence: 0.92
        };
    }

    return data;
};
