import startDecider from '../util/startDecider';
import startWorker from '../util/startWorker';
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

    // If a decider path was passed in, load and assign the module.
    if (argv.decider) {
        const decider = getDeciderModule(argv.decider);
        startDecider(domain, taskList, decider);
    }

    // If an activities path was passed in, load and assign the modules.
    if (argv.activities) {
        const activities = getActivityModules(argv.activities);
        startWorker(domain, taskList, activities);
    }
};
