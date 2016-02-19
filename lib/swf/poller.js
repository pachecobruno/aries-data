import events from 'events';
import stampit from 'stampit';
import Queue from 'promise-queue';
import eventEmitter from '../util/eventEmitter';
import logger from '../util/logger';
const log = logger(__filename);

export default stampit.compose(eventEmitter, stampit.props({
    // Flag to start/stop poller.
    stopPoller: true,

    // Maximum tasks to run concurrently.
    maxConcurrent: 10,
}).init(function() {
    // Check for client.
    if (!this.client) {
        throw new Error('Poller requires a client');
    }

    // Check for valid configuration.
    const config = this.config || {};
    if (!(config.domain && config.taskList)) {
        throw new Error('Poller requires a domain and taskList');
    }

    // Create a queue to manage concurrency.
    // TODO: IMPLEMENT ME.  Once implemented, the poller
    // can fetch jobs one after another, up to maxConcurrent and process them.
    this.queue = new Queue(this.maxConcurrent, Infinity);
}).methods({
    /**
     * Start polling.
     */
    start() {
        log('Starting poller.');
        this.stopPoller = false;
        this.poll();
    },

    /**
     * Stop polling.
     */
    stop() {
        log('Stopping poller.');
        this.stopPoller = true;
    },

    /**
     * Poll this pollers poll method until `stop` is called.
     */
    async poll() {
        if (this.stopPoller) return;

        this.emit('poll');

        try {
            const result = await this.client[this.pollMethod](this.config);
            if (result.taskToken) {
                await this._onTask(result);
            }
        } catch(e) {
            log(e);
            this.emit('error', e);
        }

        // Tail-call poll again.
        return this.poll();
    }
}));
