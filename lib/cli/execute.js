import moment from 'moment';
import createLogger from '../util/logger';
import { openTunnel } from '../util/tunnel';

// Create logger.
const log = createLogger(__filename);
/**
 * Execute an aries module.
 */
export default async function execute({ repo, _: args }) {
    try {
        // Require in the specified module.
        const pkg = require(repo || process.cwd());

        // Grab `default` if it exists.
        const Module = pkg.default ? pkg.default : pkg;

        // Log module name.
        log.debug(`Loaded ${((Module.props || {}).name || 'unnamed module')}.`);

        // Instantiate a new task handler.
        const handler = new Module();

        const parsedArgs = parse(args);

        const [task, config] = parsedArgs;

        if ((config.connection || {}).vpnConnection) {
          await openTunnel(config.vpnConnection);
        }
        // Run the handler and get the output.
        const result = await runTask(handler, parsedArgs);

        // Log the result.
        log.debug('Task result: ', result);

        // Return the result.
        return result;

    } catch (err) {
        // Log the error.
        log.error('Error executing task:', err);

        // Rethrow the error.
        throw err;

    } finally {
        // Log out final message.
        log.debug('Finished executing task.');
    }
};


/**
 * Apply the cli arguments to the module.
 */
export async function runTask(handler, args) {
    // Log out arguments.
    log.debug(`Executing task with ${args.length} args.`);
    log.debug(args);

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


/**
 * Parse strings from cli.
 */
export function parse(args) {
    // Destructure.
    const [ task, config, executionDate ] = args;

    // Return the parsed version.
    return [
        JSONparse(task),
        JSONparse(config),
        new Date(executionDate),
    ];
};


/**
 * Helper function to return the original string if json parse fails.
 */
export function JSONparse(str) {
    try {
        return JSON.parse(str);
    } catch(err) {
        return str;
    }
};
