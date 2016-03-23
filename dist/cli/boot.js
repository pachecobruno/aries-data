'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = boot;

var _Aries = require('../Aries');

var _Aries2 = _interopRequireDefault(_Aries);

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

    // Create aries instance.
    var aries = new _Aries2.default({ domain: domain, taskList: taskList });

    // If a decider path was passed in, load and assign the module.
    if (argv.decider) {
        var decider = (0, _getDeciderModule2.default)(argv.decider);
        aries.startDecider(decider);
    }

    // If an activities path was passed in, load and assign the modules.
    if (argv.activities) {
        var activities = (0, _getActivityModules2.default)(argv.activities);
        aries.startWorker(activities);
    }
};