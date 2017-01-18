import createLogger from './util/logger';
import rootPackage from './util/rootPackage';

/**
 * Base Activity
 */
export default class Activity {

    constructor() {
        const { name } = rootPackage;
        if (!name) {
            throw new Error('Activities require a name in package.json');
        }

        this.log = createLogger(`activity:${name}`);
    }

    // eslint-disable-next-line no-unused-vars, class-methods-use-this
    async onTask(activityTask) {
        return; // eslint-disable-line no-useless-return
    }
}
