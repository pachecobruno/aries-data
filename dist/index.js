'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singleS3StreamInput = exports.singleS3FileInput = exports.singleS3FileOutput = exports.boot = exports.registerActivity = exports.workflowStateProvider = exports.activityConfigProvider = exports.decider = exports.Activity = exports.aws = undefined;

var _activity = require('./swf/activity');

Object.defineProperty(exports, 'Activity', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_activity).default;
  }
});

var _decider = require('./swf/decider');

Object.defineProperty(exports, 'decider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_decider).default;
  }
});

var _activityConfigProvider = require('./swf/activityConfigProvider');

Object.defineProperty(exports, 'activityConfigProvider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_activityConfigProvider).default;
  }
});

var _workflowStateProvider = require('./swf/workflowStateProvider');

Object.defineProperty(exports, 'workflowStateProvider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_workflowStateProvider).default;
  }
});

var _registerActivity = require('./swf/registerActivity');

Object.defineProperty(exports, 'registerActivity', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_registerActivity).default;
  }
});

var _boot = require('./boot/boot');

Object.defineProperty(exports, 'boot', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_boot).default;
  }
});

var _singleS3FileOutput = require('./decorators/singleS3FileOutput');

Object.defineProperty(exports, 'singleS3FileOutput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_singleS3FileOutput).default;
  }
});

var _singleS3FileInput = require('./decorators/singleS3FileInput');

Object.defineProperty(exports, 'singleS3FileInput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_singleS3FileInput).default;
  }
});

var _singleS3StreamInput = require('./decorators/singleS3StreamInput');

Object.defineProperty(exports, 'singleS3StreamInput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_singleS3StreamInput).default;
  }
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

var _aws2 = require('./util/aws');

var _aws = _interopRequireWildcard(_aws2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default export is just a basic stamp.
/*
 * Main entry point when imported.
 * Export important modules.
 */

exports.default = _stampit2.default.init(function () {
  // Set up a default logger.
  this.log = (0, _logger2.default)('mixin');
});
exports.aws = _aws;