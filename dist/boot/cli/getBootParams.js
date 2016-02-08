'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getBootParams;

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
function getBootParams(argv) {
    var params = {};

    // Pass through domain and taskList.
    params.domain = argv.domain;
    params.taskList = argv.tasklist;

    // If a decider path was passed in, load and assign the module.
    if (argv.decider) {
        params.decider = (0, _getDeciderModule2.default)(argv.decider);
    }

    // If an activities path was passed in, load and assign the modules.
    if (argv.activities) {
        params.activities = (0, _getActivityModules2.default)(argv.activities);
    }

    return params;
};