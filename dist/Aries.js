'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _decisionPoller = require('./swf/decisionPoller');

var _decisionPoller2 = _interopRequireDefault(_decisionPoller);

var _activityPoller = require('./swf/activityPoller');

var _activityPoller2 = _interopRequireDefault(_activityPoller);

var _registerActivity = require('./swf/registerActivity');

var _registerActivity2 = _interopRequireDefault(_registerActivity);

var _activity = require('./swf/activity');

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = (0, _logger2.default)(__filename);

var Aries = (function () {
    function Aries() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Aries);

        // Set any log streams.
        _logger.logger.setLogStreams(options.logStreams);

        // Fallback to env if necessary.
        this.domain = options.domain || process.env.ARIES_DOMAIN;
        this.taskList = options.taskList || process.env.ARIES_TASKLIST;

        (0, _assert2.default)(this.domain, 'A domain must be specified');
        (0, _assert2.default)(this.taskList, 'A tasklist must be specified');
    }

    _createClass(Aries, [{
        key: 'startDecider',
        value: function startDecider(deciderFactory) {
            // Create config for decider.
            var config = { domain: this.domain, taskList: { name: this.taskList } };

            // Create the decider.
            var decider = deciderFactory({ taskList: this.taskList });

            // Create poller.
            var poller = (0, _decisionPoller2.default)({ config: config, decider: decider });

            // Start polling for decisions.
            poller.start();
        }
    }, {
        key: 'startWorker',
        value: function startWorker(activities) {
            var _this = this;

            // Create config for poller.
            var config = { domain: this.domain, taskList: { name: this.taskList + '-activities' } };

            // Create activity poller.
            var poller = (0, _activityPoller2.default)({ config: config, activities: activities });

            // Register activities concurrently.
            var promises = activities.map(function (act) {
                var props = Object.assign({}, _activity2.default.props, act.props);
                return (0, _registerActivity2.default)(_this.domain, props);
            });

            // Wait for all activities to be registered, then start polling.
            Promise.all(promises).then(poller.start.bind(poller)).catch(log.error.bind(log));
        }
    }]);

    return Aries;
})();

exports.default = Aries;