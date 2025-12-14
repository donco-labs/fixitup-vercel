// Utility for calculating task due dates
// Supports: Intervals (Days/Weeks/Years), Annual Dates, and Whimsical Logic

export const FREQUENCY_TYPES = {
    INTERVAL: 'interval',
    ANNUAL: 'annual',
    WHIMSY: 'whimsy'
};

export const WHIMSY_TYPES = {
    FULL_MOON: 'full_moon',
    FRIDAY_13TH: 'friday_13th',
    LEAP_DAY: 'leap_day'
};

// Known Full Moon: Jan 13, 2025 22:27 UTC
// Synodic Month: 29.53059 days
const REFERENCE_MOON = new Date('2025-01-13T22:27:00Z');
const LUNAR_CYCLE = 29.53059 * 24 * 60 * 60 * 1000;

export const calculateNextDue = (task) => {
    const now = new Date();
    // Reset time to start of day for cleaner comparisons, unless we need precision
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (task.frequencyType === FREQUENCY_TYPES.INTERVAL) {
        // days, weeks, years handled via multipliers in the UI, passed as raw days here ideally?
        // Or we support units. Let's support units in the task object for better UI display.
        // Task: { intervalUnit: 'days' | 'weeks' | 'years', intervalValue: 1 }

        // Fallback for legacy "frequencyDays"
        let daysToAdd = task.frequencyDays || 30;

        if (task.intervalUnit === 'weeks') daysToAdd = task.intervalValue * 7;
        if (task.intervalUnit === 'years') daysToAdd = task.intervalValue * 365; // Approx
        if (task.intervalUnit === 'days') daysToAdd = task.intervalValue;

        // If completing a task, we schedule from NOW. 
        // If calculating initial date, we schedule from NOW.
        return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
    }

    if (task.frequencyType === FREQUENCY_TYPES.ANNUAL) {
        let year = now.getFullYear();
        const dueThisYear = new Date(year, task.month, task.day);
        if (dueThisYear < today) {
            year++;
        }
        return new Date(year, task.month, task.day).toISOString();
    }

    if (task.frequencyType === FREQUENCY_TYPES.WHIMSY) {
        if (task.whimsyType === WHIMSY_TYPES.FULL_MOON) {
            let nextMoon = new Date(REFERENCE_MOON);
            while (nextMoon < now) {
                nextMoon = new Date(nextMoon.getTime() + LUNAR_CYCLE);
            }
            return nextMoon.toISOString();
        }

        if (task.whimsyType === WHIMSY_TYPES.FRIDAY_13TH) {
            let d = new Date(now);
            d.setDate(13); // Jump to the 13th of current month
            // If we passed the 13th, go to next month
            if (d < today) {
                d.setMonth(d.getMonth() + 1);
            }

            // Search for next Friday
            while (d.getDay() !== 5) { // 5 = Friday
                d.setMonth(d.getMonth() + 1);
                d.setDate(13);
            }
            return d.toISOString();
        }

        if (task.whimsyType === WHIMSY_TYPES.LEAP_DAY) {
            let year = now.getFullYear();
            const getLeapDate = (y) => new Date(y, 1, 29); // Feb 29
            const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);

            let nextLeap = getLeapDate(year);
            // Check if this year is leap and date hasn't passed
            if (!isLeap(year) || nextLeap < today) {
                // Find next leap year
                do {
                    year++;
                } while (!isLeap(year));
                nextLeap = getLeapDate(year);
            }
            return nextLeap.toISOString();
        }
    }

    // Default fallback
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
};
