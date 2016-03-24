// import Queue from 'promise-queue';
import { createSWFClient } from '../../util/aws';
import logger from '../../decorators/logger';

@logger()
export default class Poller {
    // Maximum tasks to run concurrently.
    static maxConcurrent = 10;

    constructor(config) {
        // Create an SWF client.
        this.client = createSWFClient();

        // Check for valid configuration.
        if (!(config.domain && config.taskList)) {
            throw new Error('Poller requires a domain and taskList');
        }

        // Save config for later.
        this.config = config;

        // Create a queue to manage concurrency.
        // TODO: IMPLEMENT ME.  Once implemented, the poller
        // can fetch jobs one after another, up to maxConcurrent and process them.
        // this.queue = new Queue(Poller.maxConcurrent, Infinity);

        this.stopPoller = true;
    }

    /**
     * Start polling.
     */
    start() {
        this.log.info('Starting poller.');
        this.stopPoller = false;
        this.poll();
    }

    /**
     * Stop polling.
     */
    stop() {
        this.log.info('Stopping poller.');
        this.stopPoller = true;
    }

    /**
     * Poll this pollers poll method until `stop` is called.
     */
    async poll() {
        if (this.stopPoller) return;

        // this.emit('poll');
        this.log.info('Polling...');

        try {
            // Grab static poll method string.
            const pollMethod = this.constructor.pollMethod;

            this.log.info(pollMethod);

            // Call the poll method.
            const result = await this.client[pollMethod](this.config);

            this.log.info(result);

            // If we have stuff to do, call _onTask.
            if (result.taskToken) {
                await this._onTask(result);
            }
        } catch(e) {
            this.log.error(e);
            // this.emit('error', e);
        }

        // Tail-call poll again.
        return this.poll();
    }
};
