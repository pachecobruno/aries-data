import moment from 'moment';
import createLogger from '../util/logger';
import child_process from 'child_process';
const execFile = child_process.execFile;
const spawn = child_process.spawn;

// Create logger.
const log = createLogger(__filename);

function openTunnel(vpnConnection) {
  const args = [];
  const options = {
    env: {
      VPNADDR: vpnConnection.host,
      VPNUSER: vpnConnection.user,
      VPNPASS: vpnConnection.pass,
      VPNTIMEOUT: vpnConnection.timeout || 60
    }
  };

  log.debug(`opening SSLVPN tunnel: ${JSON.stringify(options)}`);
  return new Promise((resolve, reject) => {
    const forticlient = spawn('/usr/local/bin/forticlient', args, options);
    forticlient.stdout.on('data', (data) => {
      log.debug(`stdout data: "${data}"`);
      if (data === 'STATUS::Tunnel running') {
        resolve();
      }
    });
    forticlient.stderr.on('data', (data) => {
      log.debug(`stderr data: ${data}`);
    });
    forticlient.on('close', (code) => {
      log.debug(`exit: ${code}`);
    });
    forticlient.on('error', (err) => {
      log.debug(`error: ${err}`);
      reject(err);
    });
  });
};

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

        log.debug(`checking vpnConnection on config`);
        if (config.vpnConnection) {
          log.debug(`found vpnConnection on config`);
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
