'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getActivityModules;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getActivityModules(relativePath) {
    try {
        // Build path to activities directory.
        var activitiesPath = _path2.default.join(process.cwd(), relativePath);

        // Create list of actual modules.
        return _fs2.default.readdirSync(activitiesPath).map(function (file) {
            var modulePath = _path2.default.join(process.cwd(), relativePath, file);
            return require(modulePath).default;
        });
    } catch (e) {
        throw new Error('Could not load activity modules');
    }
};