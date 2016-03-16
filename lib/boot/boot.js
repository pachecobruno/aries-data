import assert from 'assert';
import { createSWFClient } from '../util/aws';
import decisionPoller from '../swf/decisionPoller';
import activityPoller from '../swf/activityPoller';
import registerActivity from '../swf/registerActivity';
import Activity from '../swf/activity';
import logger from '../util/logger';
const log = logger(__filename);

export default function boot(params) {
    // Fallback to env if necessary.
    const domain = params.domain || process.env.ARIES_DOMAIN;
    const taskList = params.taskList || process.env.ARIES_TASKLIST;

    // Ensure we have valid params to run.
    assert(params.decider || params.activities, 'A decider or actities must be specified');
    assert(domain, 'A domain must be specified');
    assert(taskList, 'A tasklist must be specified');

    // Create swf client.
    const client = createSWFClient();

    // If we have a decider, boot up a decision poller.
    if (params.decider) {
        // Create config for decider.
        const config = { domain, taskList: { name: taskList } };

        // Create the decider.
        const decider = params.decider({ taskList });

        // Create poller.
        const poller = decisionPoller({ client, config, decider });

        // Start polling for decisions.
        poller.start();
    }

    // If we have an activity list, boot up a activity poller.
    if (params.activities) {
        // Create config for poller.
        const config = { domain, taskList: { name: `${taskList}-activities` } };

        // Create the activity handlers.
        // const activities = params.activities.map(act => act());

        // Create activity poller.
        const poller = activityPoller({ client, config, activities: params.activities });

        // Register activities concurrently then start polling for activities.
        Promise.all(poller.activities
            .map(act => registerActivity(domain, Object.assign({}, Activity.props, act.props))))
            .then(poller.start.bind(poller))
            .catch(log);
    }
};
