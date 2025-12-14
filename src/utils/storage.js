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
