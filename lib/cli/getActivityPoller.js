import fs from 'fs';
import path from 'path';
import swfClient from '../swf/client';
import activityPoller from '../swf/activityPoller';

export default function getActivityPoller(activities, domain, taskList) {
    // Build path to activities directory.
    const activitiesPath = path.join(process.cwd(), activities);

    // Create list of actual modules.
    const activityModules = fs.readdirSync(activitiesPath).map(file => {
        const modulePath = path.join(process.cwd(), activities, file);
        return require(modulePath).default();
    });

    // Create config for poller.
    const config = { domain, taskList: { name: `${taskList}-activities` } };

    // Create swf client.
    const client = swfClient();

    // Create activity poller.
    return activityPoller({ client, config, activities: activityModules });
};
