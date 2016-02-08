'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = boot;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _client = require('../swf/client');

var _client2 = _interopRequireDefault(_client);

var _decisionPoller = require('../swf/decisionPoller');

var _decisionPoller2 = _interopRequireDefault(_decisionPoller);

var _activityPoller = require('../swf/activityPoller');

var _activityPoller2 = _interopRequireDefault(_activityPoller);

var _registerActivity = require('../swf/registerActivity');

var _registerActivity2 = _interopRequireDefault(_registerActivity);

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logger2.default)(__filename);

function boot(params) {
    // Fallback to env if necessary.
    var domain = params.domain || process.env.ARIES_DOMAIN;
    var taskList = params.taskList || process.env.ARIES_TASKLIST;

    // Ensure we have valid params to run.
    (0, _assert2.default)(params.decider || params.activities, 'A decider or actities must be specified');
    (0, _assert2.default)(domain, 'A domain must be specified');
    (0, _assert2.default)(taskList, 'A tasklist must be specified');

    // Create swf client.
    var client = (0, _client2.default)();

    // If we have a decider, boot up a decision poller.
    if (params.decider) {
        // Create config for decider.
        var config = { domain: domain, taskList: { name: taskList } };

        // Create the decider.
        var decider = params.decider({ taskList: taskList });

        // Create poller.
        var poller = (0, _decisionPoller2.default)({ client: client, config: config, decider: decider });

        // Start polling for decisions.
        poller.start();
    }

    // If we have an activity list, boot up a activity poller.
    if (params.activities) {
        // Create config for poller.
        var config = { domain: domain, taskList: { name: taskList + '-activities' } };

        // Create the activity handlers.
        var activities = params.activities.map(function (act) {
            return act();
        });

        // Create activity poller.
        var poller = (0, _activityPoller2.default)({ client: client, config: config, activities: activities });

        // Register activities concurrently then start polling for activities.
        Promise.all(poller.activities.map(function (act) {
            return (0, _registerActivity2.default)(domain, act.config);
        })).then(poller.start.bind(poller)).catch(log);
    }
};