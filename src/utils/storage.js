
// Utility wrapper for the window.storage API
// This allows us to easily swap the implementation later (e.g. to a real backend)

export const storage = {
    get: async (key) => {
        try {
            const result = await window.storage.get(key);
            return JSON.parse(result.value);
        } catch (error) {
            if (error.message === 'Key not found' || error.message.includes('not found')) {
                return null;
            }
            throw error;
        }
    },

    set: async (key, value) => {
        await window.storage.set(key, JSON.stringify(value));
    },

    // Specific getters for our data types to ensure type safety
    getProfile: async () => {
        return await storage.get('user-profile');
    },

    saveProfile: async (profile) => {
        return await storage.set('user-profile', profile);
    },

    getProjects: async () => {
        return (await storage.get('user-projects')) || [];
    },

    saveProjects: async (projects) => {
        return await storage.set('user-projects', projects);
    },

    getMaintenanceTasks: async () => {
        let tasks = await storage.get('maintenance-tasks');
        if (!tasks || tasks.length === 0) {
            // Seed default maintenance tasks
            const today = new Date();
            const currentYear = today.getFullYear();

            // Calculate nextDue for annual task
            let smokeAlarmNextDue = new Date(currentYear, 9, 1); // October 1st of current year
            if (today.getMonth() > 9 || (today.getMonth() === 9 && today.getDate() > 1)) {
                // If today is past Oct 1st, next due is Oct 1st of next year
                smokeAlarmNextDue = new Date(currentYear + 1, 9, 1);
            }

            const defaults = [
                {
                    id: 1,
                    title: "Change HVAC Filter",
                    frequencyType: 'interval',
                    frequencyDays: 90,
                    lastCompleted: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
                    nextDue: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days overdue
                    points: 50,
                    tags: ["HVAC", "Maintenance"]
                },
                {
                    id: 2,
                    title: "Check Smoke Alarm Batteries",
                    frequencyType: 'annual',
                    month: 9, // October (0-indexed)
                    day: 1,
                    lastCompleted: new Date(currentYear, 9, 1).toISOString(), // Completed this year (or last year if past Oct 1)
                    nextDue: smokeAlarmNextDue.toISOString(),
                    points: 100,
                    tags: ["Safety", "Electrical"]
                },
                {
                    id: 3,
                    title: "Apply Pre-emergent Fertilizer",
                    frequencyType: 'interval',
                    frequencyDays: 120,
                    lastCompleted: null,
                    nextDue: new Date().toISOString(), // Due today
                    points: 75,
                    tags: ["Landscaping", "Outdoors"]
                }
            ];
            await storage.saveMaintenanceTasks(defaults);
            return defaults;
        }
        return tasks;
    },

    saveMaintenanceTasks: async (tasks) => {
        return await storage.set('maintenance-tasks', tasks);
    },

    getCommunityPosts: async () => {
        return (await storage.get('community-posts')) || [];
    },

    saveCommunityPosts: async (posts) => {
        return await storage.set('community-posts', posts);
    },

    getLeaderboard: async () => {
        return (await storage.get('leaderboard')) || [];
    },

    saveLeaderboard: async (leaderboard) => {
        return await storage.set('leaderboard', leaderboard);
    }
};
