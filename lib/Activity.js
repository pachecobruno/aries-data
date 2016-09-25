import createLogger from './util/logger';

/**
 * Base Activity
 */
export default class Activity {
    constructor() {
        const props = this.constructor.props;

        if (!(props.name)) {
            throw new Error('Activities require a name.');
        }

        this.log = createLogger(`activity:${props.name}`);
    }

    async onTask(activityTask) {
        return;
    }
};
