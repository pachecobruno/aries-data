import child_process from 'child_process';
const spawn = child_process.spawn;

// Define standard tunnel types
export const FORTINET= 'forticlientsslvpn';
export const IPSEC = 'ipsec';
export const OPENVPN = 'openvpn';

/**
 * Calls the appropriate method to open a vpn tunnel based on type
 * @param options Object tunnel specific options
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
    return data.includes('STATUS::Tunnel running');
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
      if (checkSuccess(data)) {
        resolve();
      }
    });
    process.on('error', (err) => {
      reject(err);
    });
  });
}
