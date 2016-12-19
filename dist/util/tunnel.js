'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OPENVPN = exports.IPSEC = exports.FORTINET = undefined;
exports.createTunnel = createTunnel;
exports.createFortinetTunnel = createFortinetTunnel;
exports.createIPSecTunnel = createIPSecTunnel;
exports.createOpenVPNTunnel = createOpenVPNTunnel;

var _dns = require('dns');

var _dns2 = _interopRequireDefault(_dns);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spawn = _child_process2.default.spawn;
var log = (0, _logger2.default)(__filename);

// Define standard tunnel types
var FORTINET = exports.FORTINET = 'forticlientsslvpn';
var IPSEC = exports.IPSEC = 'ipsec';
var OPENVPN = exports.OPENVPN = 'openvpn';

/**
 * Calls the appropriate method to open a vpn tunnel based on type
 * @param options Object tunnel specific options
 * @return Promise
 */
function createTunnel(options) {
  //determine the type of tunnel to open
  var type = options.type;
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
function createFortinetTunnel(options) {
  var args = [];
  var env = {
    VPNADDR: options.host,
    VPNUSER: options.user,
    VPNPASS: options.pass,
    VPNTIMEOUT: options.timeout || 30
  };
  var target = '/usr/local/bin/forticlient';
  return spawnTunnel(target, args, env, function (data) {
    //a forticlient tunnel is open once the followed is echoed to stdout
    return new Promise(function (resolve, reject) {
      //is data equal to the expected success message?
      if (data.includes('STATUS::Tunnel running')) {
        (function () {
          //now check dns on knownHost if it exists on options
          var knownHost = options.knownHost;
          if (knownHost) {
            (function () {
              var interval = setInterval(function () {
                _dns2.default.lookup(knownHost, function (err, address) {
                  log.info('attempting to resolve DNS for host: ' + knownHost);
                  if (!err && address) {
                    //cleanup and resolve
                    log.info('resolved DNS for ' + knownHost);
                    cleanup();
                    resolve(true);
                  }
                });
              }, 500);
              var timeout = setTimeout(function () {
                //dns couldn't resolve. this is an error
                cleanup();
                reject(new Error('Failed to resolve DNS'));
              }, 5000);
              var cleanup = function cleanup() {
                clearInterval(interval);
                clearTimeout(timeout);
                log.info('cleaned up interval and timer');
              };
            })();
          } else {
            resolve(true); //no knownHost provided so assume succes
          }
        })();
      } else {
        resolve(false); //not an error to log something else
      }
    });
  });
};

function createIPSecTunnel(options) {
  //TODO
  //1) based on options, write out tunnel details to /etc/ipsec.conf and /etc/ipsec.secrets
  //2) start strongswan
  throw new Error('Not yet supported');
}

function createOpenVPNTunnel(vpnConnection) {
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
  var options = {
    detached: true,
    env: env
  };
  return new Promise(function (resolve, reject) {
    var process = spawn(target, args, options);
    process.stdout.on('data', function (data) {
      checkSuccess(data).then(function (success) {
        if (success) {
          resolve();
        }
      }).catch(function (err) {
        reject(err);
      });
    });
    process.on('error', function (err) {
      reject(err);
    });
  });
}