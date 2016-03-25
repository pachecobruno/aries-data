import Activity from '../swf/Activity';
import ActivityPoller from '../swf/pollers/ActivityPoller';
import registerActivity from '../swf/registerActivity';
import createLogger from './logger';

export default function startWorker(domain, taskList, activities) {
    const log = createLogger(__filename);

    log.debug('Preparing to start activity poller.');

    // Create config for poller.
    const config = { domain, taskList: { name: `${taskList}-activities` } };

    // Create activity poller.
    const poller = new ActivityPoller(config, activities);

    // Register activities concurrently.
    const promises = activities.map(act => {
        const props = Object.assign({}, Activity.props, act.props);
        return registerActivity(domain, props);
    });

    // Wait for all activities to be registered, then start polling.
    Promise.all(promises)
        .then(::poller.start)
        .catch(::this.log.error);
};
