import assert from 'assert';
import createLogger, { logger } from './util/logger';
import decisionPoller from './swf/decisionPoller';
import activityPoller from './swf/activityPoller';
import registerActivity from './swf/registerActivity';
import Activity from './swf/activity';
const log = createLogger(__filename);

export default class Aries {

    constructor(options={}) {
        // Set any log streams.
        logger.setLogStreams(options.logStreams);

        // Fallback to env if necessary.
        this.domain = options.domain || process.env.ARIES_DOMAIN;
        this.taskList = options.taskList || process.env.ARIES_TASKLIST;

        assert(this.domain, 'A domain must be specified');
        assert(this.taskList, 'A tasklist must be specified');
    }

    startDecider(deciderFactory) {
        // Create config for decider.
        const config = { domain: this.domain, taskList: { name: this.taskList } };

        // Create the decider.
        const decider = deciderFactory({ taskList: this.taskList });

        // Create poller.
        const poller = decisionPoller({ config, decider });

        // Start polling for decisions.
        poller.start();
    }

    startWorker(activities) {
        // Create config for poller.
        const config = { domain: this.domain, taskList: { name: `${this.taskList}-activities` } };

        // Create activity poller.
        const poller = activityPoller({ config, activities });

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
