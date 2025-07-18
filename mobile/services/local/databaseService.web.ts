class DatabaseService {
    async init() {
        console.log("⚠️ Database Service: Web platform detected. SQLite is not supported. Skipping initialization.");
        return Promise.resolve();
    }
}

export const databaseService = new DatabaseService();