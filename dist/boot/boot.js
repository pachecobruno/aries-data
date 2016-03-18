'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = boot;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _createLogger = require('../util/createLogger');

var _createLogger2 = _interopRequireDefault(_createLogger);

var _aws = require('../util/aws');

var _decisionPoller = require('../swf/decisionPoller');

var _decisionPoller2 = _interopRequireDefault(_decisionPoller);

var _activityPoller = require('../swf/activityPoller');

var _activityPoller2 = _interopRequireDefault(_activityPoller);

var _registerActivity = require('../swf/registerActivity');

var _registerActivity2 = _interopRequireDefault(_registerActivity);

var _activity = require('../swf/activity');

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _createLogger2.default)(__filename);

function boot(params) {
    // Fallback to env if necessary.
    var domain = params.domain || process.env.ARIES_DOMAIN;
    var taskList = params.taskList || process.env.ARIES_TASKLIST;

    // Ensure we have valid params to run.
    (0, _assert2.default)(params.decider || params.activities, 'A decider or actities must be specified');
    (0, _assert2.default)(domain, 'A domain must be specified');
    (0, _assert2.default)(taskList, 'A tasklist must be specified');

    // Create swf client.
    var client = (0, _aws.createSWFClient)();

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
        var _config = { domain: domain, taskList: { name: taskList + '-activities' } };

        // Create activity poller.
        var _poller = (0, _activityPoller2.default)({ client: client, config: _config, activities: params.activities });

        // Register activities concurrently then start polling for activities.
        Promise.all(_poller.activities.map(function (act) {
            return (0, _registerActivity2.default)(domain, Object.assign({}, _activity2.default.props, act.props));
        })).then(_poller.start.bind(_poller)).catch(log.error.bind(log));
    }
};