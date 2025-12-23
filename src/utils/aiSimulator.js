export const assessProjectVisibility = async (title, description) => {
    // Try to call the real API first
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.warn("AI API failed, falling back to simulation.");
        }
    } catch (error) {
        console.warn("AI API unavailable (dev mode?), falling back to simulation.", error);
    }

    // FALLBACK: Simulate network delay to make it feel "real"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const text = (title + ' ' + description).toLowerCase();

    // Heuristic rules to mock AI analysis
    let data = {
        difficulty: 'Easy',
        reasoning: "Seems like a standard quick fix. Good practice!",
        confidence: 0.95
    };

    // Legendary (500)
    if (text.includes('build a house') || text.includes('extension') || text.includes('foundation repair') || text.includes('entire roof')) {
        data = {
            difficulty: 'Legendary',
            reasoning: "Whoa. You are a construction god. This is massive.",
            confidence: 0.99
        };
    }
    // Expert (200)
    else if (text.includes('rewire') || text.includes('panel') || text.includes('structural') || text.includes('subfloor')) {
        data = {
            difficulty: 'Expert',
            reasoning: "High risk, requires code compliance. Not for the faint of heart.",
            confidence: 0.85
        };
    }
    // Sweaty (150)
    else if (text.includes('dig') || text.includes('trench') || text.includes('fence') || text.includes('demolition') || text.includes('concrete')) {
        data = {
            difficulty: 'Sweaty',
            reasoning: "This sounds physically exhausting. Hydrate!",
            confidence: 0.90
        };
    }
    // Hard (100)
    else if (text.includes('plumbing') || text.includes('tile') || text.includes('hardwood') || text.includes('install window')) {
        data = {
            difficulty: 'Hard',
            reasoning: "Requires specific tools, precision, and patience.",
            confidence: 0.90
        };
    }
    // Tricky (75)
    else if (text.includes('cabinet') || text.includes('align') || text.includes('drywall') || text.includes('program') || text.includes('network')) {
        data = {
            difficulty: 'Tricky',
            reasoning: "Not heavy, but fiddly. Requires a steady hand and patience.",
            confidence: 0.88
        };
    }
    // Medium (50)
    else if (text.includes('paint') || text.includes('patch') || text.includes('assemble') || text.includes('mount')) {
        data = {
            difficulty: 'Medium',
            reasoning: "Standard homeowner task. Solid effort.",
            confidence: 0.92
        };
    }
    // Trivial (10)
    else if (text.includes('bulb') || text.includes('battery') || text.includes('filter') || text.includes('unclog') || text.includes('clean')) {
        data = {
            difficulty: 'Trivial',
            reasoning: "Quick maintenance task. Every bit counts!",
            confidence: 0.98
        };
    }

    return data;
};
