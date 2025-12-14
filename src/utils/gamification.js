const BADGES = {
    NOVICE_FIXER: { name: 'Novice Fixer', criteria: { projects: 1 }, icon: '🔧' },
    HOME_HERO: { name: 'Home Hero', criteria: { projects: 5 }, icon: '🦸' },
    DIY_DYNAMO: { name: 'DIY Dynamo', criteria: { projects: 10 }, icon: '💥' },
    RENO_ROCKSTAR: { name: 'Reno Rockstar', criteria: { projects: 20 }, icon: '🎸' }
};

export const checkAndAwardBadges = (projects, userProfile) => {
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const currentBadges = userProfile.badges || [];
    const awardedBadges = [];

    for (const badgeKey in BADGES) {
        if (!currentBadges.includes(BADGES[badgeKey].name) && completedProjects >= BADGES[badgeKey].criteria.projects) {
            awardedBadges.push(BADGES[badgeKey].name);
        }
    }

    const updatedBadges = [...currentBadges, ...awardedBadges];
    return { updatedBadges, awardedBadges };
};

export const BERATEMENTS = [
    { text: "Your house is silently judging you.", points: 50 },
    { text: "A spider has claimed your HVAC filter as territory.", points: 25 },
    { text: "Your resale value just dropped by $0.17.", points: 10 },
    { text: "The HOA is drafting a letter as we speak.", points: 75 },
    { text: "Dad is disappointed in your maintenance schedule.", points: 100 },
    { text: "Do you want ants? Because this is how you get ants.", points: 40 },
    { text: "Your drywall is weeping soft tears of neglect.", points: 30 }
];

export const getRandomBeratement = () => {
    return BERATEMENTS[Math.floor(Math.random() * BERATEMENTS.length)];
};
