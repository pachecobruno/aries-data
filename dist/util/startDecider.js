'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = startDecider;

var _DecisionPoller = require('../swf/pollers/DecisionPoller');

var _DecisionPoller2 = _interopRequireDefault(_DecisionPoller);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startDecider(domain, taskList, decider) {
    var log = (0, _logger2.default)(__filename);

    log.debug('Preparing to start decision poller.');

    // Create config for decider.
    var config = { domain: domain, taskList: { name: taskList } };

    // Create poller.
    var poller = new _DecisionPoller2.default(config, decider);

    // Start polling for decisions.
    poller.start();
};