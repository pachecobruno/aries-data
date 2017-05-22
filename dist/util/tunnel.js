'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OPENVPN = exports.IPSEC = exports.FORTINET = undefined;
exports.createFortinetTunnel = createFortinetTunnel;
exports.createIPSecTunnel = createIPSecTunnel;
exports.createOpenVPNTunnel = createOpenVPNTunnel;
exports.createTunnel = createTunnel;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _lodash = require('lodash.pickby');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.identity');

var _lodash4 = _interopRequireDefault(_lodash3);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spawn = _child_process2.default.spawn;
var log = (0, _logger2.default)(__filename);

// Define standard tunnel codes
var FORTINET = exports.FORTINET = 'forticlientsslvpn';
var IPSEC = exports.IPSEC = 'ipsec';
var OPENVPN = exports.OPENVPN = 'openvpn';

/**
 * Maps an error code to a javascript Error
 * @param code an integer exit code
 * @return Error
 */
function fortinetErrorFromCode(code) {
    if (code === 112) return new Error('Attempt to open tunnel to Fortinet host timed out');
    if (code === 113) return new Error('Unable to resolve knownHost');
    return new Error('Failed to open tunnel to Fortinet host. Exit code ' + code);
}

/**
 * Creates a tunnel to a Fortigate appliance utilizing the forticlientsslvpn
 * client.
 * @param connection an object containing the details of the connection
 * @return Promise
 */
function createFortinetTunnel(connection) {
    return new Promise(function (resolve, reject) {
        var args = [];
        var env = {
            REMOTE_HOST: connection.remoteHost,
            USERNAME: connection.username,
            PASSWORD: connection.password,
            TRUSTED_CERT: connection.trustedCert,
            KNOWN_HOST: connection.knownHost,
            TIMEOUT: connection.timeout
        };
        var options = {
            detached: true,
            env: (0, _lodash2.default)(env, _lodash4.default) };
        var target = '/usr/local/bin/forticlient';
        var process = spawn(target, args, options);
        process.on('exit', function (code) {
            log.debug('forticlient exited with code: ' + code);
            if (code === 0) return resolve();
            return reject(fortinetErrorFromCode(code));
        });
        process.on('error', function (err) {
            reject(err);
        });
    });
}

/**
 * Maps an error code to a javascript error
 * @param code an integer exit code
 * @return Error
 */
function ipsecErrorFromCode(code) {
    if (code === 64) return new Error('Unable to find preshared key. psk must be defined');
    if (code === 65) return new Error('Authentication failed. Check your preshared key');
    if (code === 66) return new Error('Failed to establish tunnel. Tunnel definition was likely not agreed upon');
    if (code === 67) return new Error('Failed to establish tunnel. Verify ike and esp algorithms');
    if (code === 112) return new Error('Attempt to open tunnel to host timed out');
    if (code === 113) return new Error('Unable to resolve knownHost');
    return new Error('Failed to open tunnel to Fortinet host. Exit code ' + code);
}

/**
 * Creates an IPSec connection to a host.
 * Uses IKEV1, preshared key + xauth. Supports
 * host-to-network ("roadwarrior") configurations.
 * Site-to-Site tunnels are not supported
 * @param connection an object containing the parameters of the
 * tunnel
 * @return Promise resolves when tunnel is open or fails
 */
function createIPSecTunnel(connection) {
    return new Promise(function (resolve, reject) {
        var target = '/usr/local/bin/strongswan';
        var args = [];
        var env = {
            REMOTE_HOST: connection.remoteHost,
            REMOTE_SUBNET: connection.remoteSubnet,
            PSK: connection.psk,
            XAUTH_USER: connection.xauthUser,
            XAUTH_PASS: connection.xauthPass,
            IKE: connection.ike,
            ESP: connection.esp,
            IKE_LIFETIME: connection.ikeLifetime,
            TIMEOUT: connection.timeout,
            KNOWN_HOST: connection.knownHost
        };
        var options = {
            detached: true,
            env: (0, _lodash2.default)(env, _lodash4.default) };
        var process = spawn(target, args, options);
        process.on('exit', function (code) {
            log.debug('strongswan exited with code: ' + code);
            if (code === 0) return resolve();
            return reject(ipsecErrorFromCode(code));
        });
        process.on('error', function (err) {
            reject(err);
        });
    });
}

// eslint-disable-next-line
function createOpenVPNTunnel(connection) {
    // TODO
    throw new Error('Not yet supported');
}

/**
 * Calls the appropriate method to open a vpn tunnel based on code
 * @param options Object tunnel specific options
 * @return Promise
 */
function createTunnel(connection) {
    // determine the type of tunnel to open
    var code = connection.code;
    if (code === FORTINET) {
        return createFortinetTunnel(connection);
    } else if (code === OPENVPN) {
        return createOpenVPNTunnel(connection);
    }
    return createIPSecTunnel(connection);
}