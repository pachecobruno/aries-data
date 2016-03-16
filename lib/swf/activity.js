import logger from '../util/logger';

/**
 * Base Activity
 */
export default class Activity {
    static props = {
        defaultTaskHeartbeatTimeout: '900',
        defaultTaskScheduleToStartTimeout: '120',
        defaultTaskScheduleToCloseTimeout: '3800',
        defaultTaskStartToCloseTimeout: '3600',
    };

    constructor() {
        const props = this.constructor.props;
        if (!(props.name && props.version)) {
            throw new Error('Activities require a name and version');
        }
        this.log = logger(`activity:${props.name}`);
    }

    async onTask(activityTask) {
        return;
    }
};
