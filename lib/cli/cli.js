import getSettings from './getSettings';
import getDecider from './getDecider';
import getActivityPoller from './getActivityPoller';
import registerActivity from '../swf/registerActivity';
import logger from '../util/logger';
const log = logger(__filename);

/**
 * Logical entrypoint.
 * @param {Object} argv Command line args.
 */
export default function(argv) {
    // Figure out settings from cli or env.
    const { decider, activities, domain, taskList } = getSettings(argv);

    // If we need to start a decision poller.
    if (decider) {
        try {
            // Create a decider.
            const poller = getDecider(decider, domain, taskList);

            // Start it up.
            poller.start();
        } catch (e) {
            console.error('Could not boot decider', e);
        }
    }

    // If we need to start activity poller.
    if (activities) {
        try {
            // Create an activity poller.
            const poller = getActivityPoller(activities, domain, taskList);

            // Register activities concurrently then start polling for activities.
            Promise.all(poller.activities
                .map(act => registerActivity(domain, act.config)))
                .then(poller.start.bind(poller))
                .catch(log);
        } catch (e) {
            console.error('Could not boot activities', e);
        }
    }
};

