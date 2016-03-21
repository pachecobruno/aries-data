'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSWFClient = createSWFClient;
exports.createS3Client = createS3Client;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _thenifyAll = require('thenify-all');

var _thenifyAll2 = _interopRequireDefault(_thenifyAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSWFClient() {
    var raw = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var client = new _awsSdk2.default.SWF({ region: process.env.AWS_REGION });
    if (raw) return client;

    return (0, _thenifyAll2.default)(client, client, ['startWorkflowExecution', 'pollForDecisionTask', 'pollForActivityTask', 'respondDecisionTaskCompleted', 'respondActivityTaskCanceled', 'respondActivityTaskCompleted', 'respondActivityTaskFailed', 'listActivityTypes', 'registerActivityType']);
};

function createS3Client() {
    var raw = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var client = new _awsSdk2.default.S3({ region: process.env.AWS_REGION });
    if (raw) return client;

    return (0, _thenifyAll2.default)(client, client, ['getObject', 'putObject', 'deleteObject', 'upload']);
};