import getDeciderModule from './getDeciderModule';
import getActivityModules from './getActivityModules';

/**
 * Get boot params.
 * @param {Object} argv Command line args.
 * @returns {Object} Boot params.
 */
export default function getBootParams(argv) {
    const params = {};

    // Pass through domain and taskList.
    params.domain = argv.domain;
    params.taskList = argv.tasklist;

    // If a decider path was passed in, load and assign the module.
    if (argv.decider) {
        params.decider = getDeciderModule(argv.decider);
    }

    // If an activities path was passed in, load and assign the modules.
    if (argv.activities) {
        params.activities = getActivityModules(argv.activities);
    }

    return params;
};

