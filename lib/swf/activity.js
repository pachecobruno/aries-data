import stampit from 'stampit';
import logger from '../util/logger';

/**
 * Base Activity
 */
export default stampit.props({
    config: {
        defaultTaskHeartbeatTimeout: '900',
        defaultTaskScheduleToStartTimeout: '120',
        defaultTaskScheduleToCloseTimeout: '3800',
        defaultTaskStartToCloseTimeout: '3600',
    }
}).init(function() {
    if (!(this.config.name && this.config.version)) {
        throw new Error('Activities require a name and version');
    }

    // Provider a logger to deciders.
    this.log = logger(`activity:${this.config.name}`);
}).methods({
    async onTask(activityTask) {
        return;
    },
});

