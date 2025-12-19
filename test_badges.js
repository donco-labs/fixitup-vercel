
import { checkAndAwardBadges } from './src/utils/gamification.js';

const mockProfile = { badges: [] };
const mockProjectsNoStatus = [
    { title: 'Project 1', points: 10 },
    { title: 'Project 2', points: 10 }
];
const mockProjectsWithStatus = [
    { title: 'Project 1', points: 10, status: 'Completed' },
    { title: 'Project 2', points: 10, status: 'Completed' }
];

console.log("Testing with NO status:");
const result1 = checkAndAwardBadges(mockProjectsNoStatus, mockProfile);
console.log("Awarded Badges:", result1.awardedBadges);

console.log("\nTesting WITH status:");
const result2 = checkAndAwardBadges(mockProjectsWithStatus, mockProfile);
console.log("Awarded Badges:", result2.awardedBadges);
