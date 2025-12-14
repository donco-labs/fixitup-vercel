export const checkAndAwardBadges = (profile, allProjects) => {
    const newBadges = [...(profile.badges || [])];

    // First Project badge
    if (profile.completedProjects === 1 && !newBadges.includes('First Steps')) {
        newBadges.push('First Steps');
    }

    // 10 Projects badge
    if (profile.completedProjects === 10 && !newBadges.includes('Handy Helper')) {
        newBadges.push('Handy Helper');
    }

    // 25 Projects badge
    if (profile.completedProjects === 25 && !newBadges.includes('DIY Pro')) {
        newBadges.push('DIY Pro');
    }

    // 50 Projects badge
    if (profile.completedProjects === 50 && !newBadges.includes('Master Builder')) {
        newBadges.push('Master Builder');
    }

    // Point milestones
    if (profile.points >= 100 && !newBadges.includes('Century Club')) {
        newBadges.push('Century Club');
    }

    if (profile.points >= 500 && !newBadges.includes('Point Powerhouse')) {
        newBadges.push('Point Powerhouse');
    }

    if (profile.points >= 1000 && !newBadges.includes('Legendary')) {
        newBadges.push('Legendary');
    }

    // Category expert badges (5 projects in same category)
    const categories = {};
    allProjects.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
    });

    Object.entries(categories).forEach(([cat, count]) => {
        if (count >= 5 && !newBadges.includes(`${cat} Expert`)) {
            newBadges.push(`${cat} Expert`);
        }
    });

    // Perfect project (no failures)
    const lastProject = allProjects[0];
    if (lastProject && (!lastProject.failures || lastProject.failures.length === 0) && !newBadges.includes('Flawless')) {
        newBadges.push('Flawless');
    }

    // Completed an Expert difficulty project
    if (lastProject && lastProject.difficulty === 'Expert' && !newBadges.includes('Expert Tackle')) {
        newBadges.push('Expert Tackle');
    }

    return newBadges;
};

export const calculateLevel = (points) => {
    return Math.floor(points / 100) + 1;
};
