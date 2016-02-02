import fs from 'fs';
import path from 'path';

export default function getActivityModules(relativePath) {
    try {
        // Build path to activities directory.
        const activitiesPath = path.join(process.cwd(), relativePath);

        // Create list of actual modules.
        return fs.readdirSync(activitiesPath).map(file => {
            const modulePath = path.join(process.cwd(), relativePath, file);
            return require(modulePath).default;
        });
    } catch (e) {
        throw new Error('Could not load activity modules');
    }
};
