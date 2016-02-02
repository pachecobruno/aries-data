import fs from 'fs';
import path from 'path';

export default function getDeciderModule(relativePath) {
    try {
        // Buld path to decider.
        const deciderPath = path.join(process.cwd(), relativePath);

        // Create decider module.
        return require(deciderPath).default;
    } catch (e) {
        throw new Error('Could not load decider module');
    }
};
