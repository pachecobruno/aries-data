import Aries from '../Aries';
import getDeciderModule from './getDeciderModule';
import getActivityModules from './getActivityModules';

/**
 * Get boot params.
 * @param {Object} argv Command line args.
 * @returns {Object} Boot params.
 */
export default function boot(argv) {
    // Pass through domain and taskList.
    const domain = argv.domain;
    const taskList = argv.tasklist;

    // Create aries instance.
    const aries = new Aries({ domain, taskList });

    // If a decider path was passed in, load and assign the module.
    if (argv.decider) {
        const decider = getDeciderModule(argv.decider);
        aries.startDecider(decider);
    }

    // If an activities path was passed in, load and assign the modules.
    if (argv.activities) {
        const activities = getActivityModules(argv.activities);
        aries.startWorker(activities);
    }
};
