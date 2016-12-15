import dns from 'dns';
import child_process from 'child_process';
import createLogger from './logger';
const spawn = child_process.spawn;
const log = createLogger(__filename);

// Define standard tunnel types
export const FORTINET= 'forticlientsslvpn';
export const IPSEC = 'ipsec';
export const OPENVPN = 'openvpn';

/**
 * Calls the appropriate method to open a vpn tunnel based on type
 * @param options Object tunnel specific options
 * @return Promise
 */
export function createTunnel(options) {
  //determine the type of tunnel to open
  const type = options.type;
  if (type === FORTINET) {
    return createFortinetTunnel(options);
  } else if (type === OPENVPN) {
    return createOpenVPNTunnel(options);
  } else {
    return createIPSecTunnel(options);
  }
}

/**
 * Creates a tunnel to a Fortigate appliance utilizing the forticlientsslvpn
 * client.
 * @param options an object containing the connection info
 * @return Promise
 */
export function createFortinetTunnel(options) {
  const args = [];
  const env = {
    VPNADDR: options.host,
    VPNUSER: options.user,
    VPNPASS: options.pass,
    VPNTIMEOUT: options.timeout || 30
  };
  const target = '/usr/local/bin/forticlient';
  return spawnTunnel(target, args, env, (data) => {
    //a forticlient tunnel is open once the followed is echoed to stdout
    return new Promise((resolve, reject) => {
      //is data equal to the expected success message?
      if (data.includes('STATUS::Tunnel running')) {
        //now check dns on knownHost if it exists on options
        const knownHost = options.knownHost;
        if (knownHost) {
          const interval = setInterval(() => {
            dns.lookup(knownHost, (err, address) => {
              log.info(`attempting to resolve DNS for host: ${knownHost}`);
              if (!err && address) {
                //cleanup and resolve
                log.info(`resolved DNS for ${knownHost}`);
                cleanup();
                resolve(true);
              }
            });
          }, 500);
          const timeout = setTimeout(() => {
            //dns couldn't resolve. this is an error
            cleanup();
            reject(new Error('Failed to resolve DNS'));
          }, 5000);
          const cleanup = function() {
            clearInterval(interval);
            clearTimeout(timeout);
            log.info('cleaned up interval and timer');
          }
        } else {
          resolve(true); //no knownHost provided so assume succes
        }
      } else {
        resolve(false);//not an error to log something else
      }
    });
  });
};

export function createIPSecTunnel(options) {
  //TODO
  //1) based on options, write out tunnel details to /etc/ipsec.conf and /etc/ipsec.secrets
  //2) start strongswan
  throw new Error('Not yet supported');
}

export function createOpenVPNTunnel(vpnConnection) {
  //TODO
  throw new Error('Not yet supported');
}

/**
 * Spawns the tunnel by executing the appropriate package installed on the host
 * @param target the target program to spawn
 * @param args command line arguments to pass to target
 * @param env environment variables to make available to target
 * @param checkSuccess Function a function that accepts a single param and returns true or false
 * if the tunnel is open
 * @return Promise
 */
function spawnTunnel(target, args, env, checkSuccess) {
  const options = {
    detached: true,
    env: env
  };
  return new Promise((resolve, reject) => {
    const process = spawn(target, args, options);
    process.stdout.on('data', (data) => {
      checkSuccess(data).then((success) => {
        if (success) {
          resolve();
        }
      }).catch(err => { reject(err) });
    });
    process.on('error', (err) => {
      reject(err);
    });
  });
}
