import assert from 'assert';
import createLogger, { logger } from './util/logger';
import DecisionPoller from './swf/pollers/DecisionPoller';
import ActivityPoller from './swf/pollers/ActivityPoller';
import registerActivity from './swf/registerActivity';
import Activity from './swf/Activity';

export default class Aries {

    constructor(options={}) {
        // Set any log streams.
        logger.setLogStreams(options.logStreams);

        // Create a logger for this instance.
        this.log = createLogger(__filename);

        // Fallback to env if necessary.
        this.domain = options.domain || process.env.ARIES_DOMAIN;
        this.taskList = options.taskList || process.env.ARIES_TASKLIST;

        assert(this.domain, 'A domain must be specified.');
        assert(this.taskList, 'A tasklist must be specified.');
    }

    startDecider(deciderFactory) {
        this.log.debug('Starting decider.');

        // Create config for decider.
        const config = { domain: this.domain, taskList: { name: this.taskList } };

        // Create the decider.
        const decider = deciderFactory({ taskList: this.taskList });

        // Create poller.
        const poller = new DecisionPoller(config, decider);

        // Start polling for decisions.
        poller.start();
    }

    startWorker(activities) {
        this.log.debug('Starting worker.');

        // Create config for poller.
        const config = { domain: this.domain, taskList: { name: `${this.taskList}-activities` } };

        // Create activity poller.
        const poller = new ActivityPoller(config, activities);

        // Register activities concurrently.
        const promises = activities.map(act => {
            const props = Object.assign({}, Activity.props, act.props);
            return registerActivity(this.domain, props);
        });

        // Wait for all activities to be registered, then start polling.
        Promise.all(promises)
            .then(::poller.start)
            .catch(::log.error);
    }
}
