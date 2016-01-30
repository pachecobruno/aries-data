import swfClient from './client';
import logger from '../util/logger';
const log = logger(__filename);

/**
 * Export a function to register activities with SWF
 */
export default async function registerActivity(domain, config) {
    // Create client.
    const client = swfClient();

    // Get registered activities for this domain.
    const activityTypes = await client.listActivityTypes({
        domain,
        registrationStatus: 'REGISTERED',
    });

    // Find one that matches the name/version in config.
    const matchedActivity = activityTypes.typeInfos.find(at => {
        return at.activityType.name === config.name && at.activityType.version === config.version;
    });

    // Return early if it's already registered.
    if (matchedActivity) {
        return log(`${config.name}/${config.version} already registered`);
    }

    // Merge config and register activity.
    const fullConfig = Object.assign({ domain }, config);
    await client.registerActivityType(fullConfig);
    return log(`${config.name}/${config.version} has been registered`);
};
