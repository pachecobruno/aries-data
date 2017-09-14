import { URL } from 'url';
import knex from 'knex';
import moment from 'moment';
import omit from 'lodash.omit';
import cryptobject from 'cryptobject';
import createLogger from '../util/logger';
import { createTunnel } from '../util/tunnel';

const { decryptor } = cryptobject;
// Create logger.
const log = createLogger(__filename);


async function getConnection(connId) {
    // TODO: support more than just the airflow connection table
    const connectionURL = new URL(process.env.ARIES_CONNECTION_STRING);
    if (connectionURL.protocol === 'postgresql') {
        connectionURL.protocol = 'postgres';
    }
    // connectionString like postgres://user:pass@host:port
    const db = knex({
        client: 'pg',
        connection: connectionURL.toString(),
    });
    const connection = await db.select().from('connection').where({
        connId,
    }).first();
    if (!connection) {
        throw new Error(`Connection ${connId} does not exist`);
    }
    if (connection.extra) {
        try {
            const extraJson = JSON.parse(connection.extra);
            return { ...connection, ...extraJson };
        } catch (err) {
            return connection;
        }
    }
    return connection;
}

/**
 * Apply the cli arguments to the module.
 */
export async function runTask(handler, args) {
    // Log out arguments.
    log.debug(`Executing task with ${args.length} args.`);

    // Start timer.
    const start = process.hrtime();

    // Attempt to execute the task.
    const output = await handler.onTask(...args);

    // Get duration.
    const [seconds] = process.hrtime(start);
    const duration = moment.duration(seconds, 'seconds').humanize();
    log.debug(`Task executed in ${duration} (${seconds} sec).`);

    // Mimic legacy SWF behavior.
    return { input: output };
}

/**
 * Helper function to return the original string if json parse fails.
 */
export function JSONparse(str) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return str;
    }
}

/**
 * decrypts a connection if it's defined and
 * connection._encrypted is true
 * @return {object} the decrypted connection if _encrypted is true.
 * Otherwise the original connection
 * Note: connection.code is not decrypted
 */
function decryptConnection(connection, encryptionKey) {
    if (connection && connection._encrypted) {
        // don't decrypt object.code
        const ignore = ['code'];
        return decryptor(encryptionKey)(connection, ignore);
    }
    return connection;
}

/**
 * checks for a connection object on config and decrypts it
 * if ENCRYPTION_KEY was passed into the environment and
 * connection._encrypted is true. If connection.vpnConnection
 * exists, it will also be decrypted, also only if vpnConnection._encrypted
 * is true..
 * @return {Object} the config with the connection decrypted
 */
export function decryptConfig(config, encryptionKey = process.env.ENCRYPTION_KEY) {
    // if no encryptionKey or connection, just return the config as is
    if (!encryptionKey || !config.connection) return config;
    // exclude the vpnConnection so we can check if it's encrypted separately
    const vpnConnectionOmitted = omit(config.connection, ['vpnConnection']);
    // decrypt connection if _encrypted = true
    const connection = decryptConnection(vpnConnectionOmitted, encryptionKey);
    // decrypt vpnConnection if _encrypted = true
    const vpnConnection = decryptConnection(config.connection.vpnConnection, encryptionKey);
    // put the config back together
    if (vpnConnection) {
        connection.vpnConnection = vpnConnection;
    }
    return { ...config, connection };
}

/**
 * Parse strings from cli.
 */
export function parse(args) {
    // Destructure.
    const [task, config, executionDate, nextExecutionDate] = args;

    // Return the parsed version.
    return [
        JSONparse(task),
        decryptConfig(JSONparse(config)),
        new Date(executionDate),
        nextExecutionDate ? new Date(nextExecutionDate) : null,
    ];
}

/**
 * Execute an aries module.
 */
export default async function execute({ repo, _: args }) {
    try {
        // Require in the specified module.
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const pkg = require(repo || process.cwd());

        // Grab `default` if it exists.
        const Module = pkg.default ? pkg.default : pkg;

        // Log module name.
        log.debug(`Loaded ${((Module.props || {}).name || 'unnamed module')}.`);

        // Instantiate a new task handler.
        const handler = new Module();

        const parsedArgs = parse(args);

        // destructure and ignore task at index 0
        const [, config] = parsedArgs;

        // check for conn_id and populate it if exists
        if (config.conn_id) {
            const connection = await getConnection(config.conn_id);
            config.connection = connection;
            log.info('Acquired connection');
        }

        if ((config.connection || {}).vpnConnection) {
            await createTunnel(config.connection.vpnConnection);
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
