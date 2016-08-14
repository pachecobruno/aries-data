import moment from 'moment';
import createLogger from '../util/logger';

// Create logger.
const log = createLogger(__filename);

// Function to parse json if it can.
const parse = arg => {
    try {
        return JSON.parse(arg);
    } catch(e) {
        return arg;
    }
};

// Run the task, keep some stats.
async function runTask(handler, args) {
    // Log out arguments.
    log.debug(`Executing task with ${args.length} args.`);
    // args.forEach((arg, i) => log.debug(`${i} ->`, arg));

    // Start timer.
    const start = process.hrtime();

    // Attempt to execute the task.
    const output = await handler.onTask.apply(handler, args);

    // Get duration.
    const [ seconds ] = process.hrtime(start);
    const duration = moment.duration(seconds, 'seconds').humanize();
    log.debug(`Task executed in ${duration} (${seconds} sec).`);

    // Mimic legacy SWF behavior.
    return { input: output };
};


// Export function to execute aries repos.
export default async function execute({ repo, _ }) {
    try {
        // Parse args.
        const args = _.map(parse);

        // Require in the module.
        const pkg = require(repo || process.cwd());

        // Grab `default` if it exists.
        const Module = pkg.default ? pkg.default : pkg;

        // Log module name.
        log.debug(`Loaded ${((Module.props || {}).name || 'unnamed module')}.`);

        // Instantiate a new task handler.
        const handler = new Module();

        // Run the handler and get the output.
        const output = await runTask(handler, args);

        // Stringify the final output and log it to STDOUT for airflow, with no bunyan chrome.
        log.debug('Task return value:');
        console.log(JSON.stringify(output));

    } catch(e) {
        log.error('Error executing task:', e);
        process.exit(1);
    }
};
