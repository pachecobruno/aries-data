'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createClient;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _thenifyAll = require('thenify-all');

var _thenifyAll2 = _interopRequireDefault(_thenifyAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createClient() {
    var client = new _awsSdk2.default.SWF({ region: 'us-east-1' });
    return (0, _thenifyAll2.default)(client, client, ['startWorkflowExecution', 'pollForDecisionTask', 'pollForActivityTask', 'respondDecisionTaskCompleted', 'respondActivityTaskCanceled', 'respondActivityTaskCompleted', 'respondActivityTaskFailed', 'listActivityTypes', 'registerActivityType']);
};