import childProcess from 'child_process';
import createLogger from './logger';

const spawn = childProcess.spawn;
const log = createLogger(__filename);

// Define standard tunnel codes
export const FORTINET = 'forticlientsslvpn';
export const IPSEC = 'ipsec';
export const OPENVPN = 'openvpn';

/**
 * Creates a tunnel to a Fortigate appliance utilizing the forticlientsslvpn
 * client.
 * @param connection an object containing the details of the connection
 * @return Promise
 */
export function createFortinetTunnel(connection) {
    return new Promise((resolve, reject) => {
        const args = [];
        const env = {
            VPNADDR: connection.host,
            VPNUSER: connection.user,
            VPNPASS: connection.pass,
            VPNTIMEOUT: connection.timeout || 30,
        };
        const options = {
            detached: true,
            env,
        };
        const target = '/usr/local/bin/forticlient';
        const process = spawn(target, args, options);
        process.on('exit', (code) => {
            log.debug(`forticlient exited with code: ${code}`);
            resolve();
        });
        process.on('error', (err) => {
            reject(err);
        });
    });
}

export function createIPSecTunnel(connection) {
    return new Promise((resolve, reject) => {
        const target = '/usr/local/bin/strongswan';
        const args = [];
        const options = {
            detached: true,
        };
        const process = spawn(target, args, options);
        process.on('exit', (code) => {
            log.debug(`strongswan exited with code: ${code}`);
            resolve();
        });
        process.on('error', (err) => {
            reject(err);
        });
    });
}

// eslint-disable-next-line
export function createOpenVPNTunnel(connection) {
    // TODO
    throw new Error('Not yet supported');
}

/**
 * Calls the appropriate method to open a vpn tunnel based on code
 * @param options Object tunnel specific options
 * @return Promise
 */
export function createTunnel(connection) {
    // determine the type of tunnel to open
    const code = connection.code;
    if (code === FORTINET) {
        return createFortinetTunnel(connection);
    } else if (code === OPENVPN) {
        return createOpenVPNTunnel(connection);
    }
    return createIPSecTunnel(connection);
}
