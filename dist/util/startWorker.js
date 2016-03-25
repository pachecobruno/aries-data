'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = startWorker;

var _Activity = require('../swf/Activity');

var _Activity2 = _interopRequireDefault(_Activity);

var _ActivityPoller = require('../swf/pollers/ActivityPoller');

var _ActivityPoller2 = _interopRequireDefault(_ActivityPoller);

var _registerActivity = require('../swf/registerActivity');

var _registerActivity2 = _interopRequireDefault(_registerActivity);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startWorker(domain, taskList, activities) {
    var _context;

    var log = (0, _logger2.default)(__filename);

    log.debug('Preparing to start activity poller.');

    // Create config for poller.
    var config = { domain: domain, taskList: { name: taskList + '-activities' } };

    // Create activity poller.
    var poller = new _ActivityPoller2.default(config, activities);

    // Register activities concurrently.
    var promises = activities.map(function (act) {
        var props = Object.assign({}, _Activity2.default.props, act.props);
        return (0, _registerActivity2.default)(domain, props);
    });

    // Wait for all activities to be registered, then start polling.
    Promise.all(promises).then(poller.start.bind(poller)).catch((_context = this.log).error.bind(_context));
};