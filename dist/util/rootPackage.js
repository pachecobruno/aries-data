'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Exports the root package.json as an object
 * Use to retrieve metadata about the activity
 * @return {Object} an object representing the activity's package.json
 */
exports.default = require(_appRootPath2.default + '/package.json');