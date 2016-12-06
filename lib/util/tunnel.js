import child_process from 'child_process';
const execFile = child_process.execFile;
const spawn = child_process.spawn;


export function openTunnel(vpnConnection) {
  const args = [];
  const options = {
    detached: true,
    env: {
      VPNADDR: vpnConnection.host,
      VPNUSER: vpnConnection.user,
      VPNPASS: vpnConnection.pass,
      VPNTIMEOUT: vpnConnection.timeout || 30
    }
  };

  log.debug(`opening SSLVPN tunnel`);
  return new Promise((resolve, reject) => {
    const forticlient = spawn('/usr/local/bin/forticlient', args, options);
    forticlient.stdout.on('data', (data) => {
      if (data.includes('STATUS::Tunnel running')) {
        log.debug('Opened Tunnel');
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
