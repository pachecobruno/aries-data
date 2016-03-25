'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = boot;

var _startDecider = require('../util/startDecider');

var _startDecider2 = _interopRequireDefault(_startDecider);

var _startWorker = require('../util/startWorker');

var _startWorker2 = _interopRequireDefault(_startWorker);

var _getDeciderModule = require('./getDeciderModule');

var _getDeciderModule2 = _interopRequireDefault(_getDeciderModule);

var _getActivityModules = require('./getActivityModules');

var _getActivityModules2 = _interopRequireDefault(_getActivityModules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get boot params.
 * @param {Object} argv Command line args.
 * @returns {Object} Boot params.
 */
function boot(argv) {
    // Pass through domain and taskList.
    var domain = argv.domain;
    var taskList = argv.tasklist;

    // If a decider path was passed in, load and assign the module.
    if (argv.decider) {
        var decider = (0, _getDeciderModule2.default)(argv.decider);
        (0, _startDecider2.default)(domain, taskList, decider);
    }

    // If an activities path was passed in, load and assign the modules.
    if (argv.activities) {
        var activities = (0, _getActivityModules2.default)(argv.activities);
        (0, _startWorker2.default)(domain, taskList, activities);
    }
};