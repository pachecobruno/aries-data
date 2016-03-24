'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _dec, _class;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _DecisionPoller = require('./swf/pollers/DecisionPoller');

var _DecisionPoller2 = _interopRequireDefault(_DecisionPoller);

var _ActivityPoller = require('./swf/pollers/ActivityPoller');

var _ActivityPoller2 = _interopRequireDefault(_ActivityPoller);

var _registerActivity = require('./swf/registerActivity');

var _registerActivity2 = _interopRequireDefault(_registerActivity);

var _Activity = require('./swf/Activity');

var _Activity2 = _interopRequireDefault(_Activity);

var _logger = require('./decorators/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Aries = (_dec = (0, _logger2.default)(), _dec(_class = (function () {
    function Aries() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Aries);

        // Fallback to env if necessary.
        this.domain = options.domain || process.env.ARIES_DOMAIN;
        this.taskList = options.taskList || process.env.ARIES_TASKLIST;

        (0, _assert2.default)(this.domain, 'A domain must be specified.');
        (0, _assert2.default)(this.taskList, 'A tasklist must be specified.');
    }

    _createClass(Aries, [{
        key: 'startDecider',
        value: function startDecider(decider) {
            this.log.debug('Preparing to start decision poller.');

            // Create config for decider.
            var config = { domain: this.domain, taskList: { name: this.taskList } };

            // Create poller.
            var poller = new _DecisionPoller2.default(config, decider);

            // Start polling for decisions.
            poller.start();
        }
    }, {
        key: 'startWorker',
        value: function startWorker(activities) {
            var _this = this,
                _context;

            this.log.debug('Preparing to start activity poller.');

            // Create config for poller.
            var config = { domain: this.domain, taskList: { name: this.taskList + '-activities' } };

            // Create activity poller.
            var poller = new _ActivityPoller2.default(config, activities);

            // Register activities concurrently.
            var promises = activities.map(function (act) {
                var props = Object.assign({}, _Activity2.default.props, act.props);
                return (0, _registerActivity2.default)(_this.domain, props);
            });

            // Wait for all activities to be registered, then start polling.
            Promise.all(promises).then(poller.start.bind(poller)).catch((_context = this.log).error.bind(_context));
        }
    }]);

    return Aries;
})()) || _class);
exports.default = Aries;