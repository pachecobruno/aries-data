'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boot = exports.registerActivity = exports.workflowStateProvider = exports.activityConfigProvider = exports.decider = exports.activity = exports.swf = undefined;

var _client = require('./swf/client');

Object.defineProperty(exports, 'swf', {
  enumerable: true,
  get: function get() {
    return _client.default;
  }
});

var _activity = require('./swf/activity');

Object.defineProperty(exports, 'activity', {
  enumerable: true,
  get: function get() {
    return _activity.default;
  }
});

var _decider = require('./swf/decider');

Object.defineProperty(exports, 'decider', {
  enumerable: true,
  get: function get() {
    return _decider.default;
  }
});

var _activityConfigProvider = require('./swf/activityConfigProvider');

Object.defineProperty(exports, 'activityConfigProvider', {
  enumerable: true,
  get: function get() {
    return _activityConfigProvider.default;
  }
});

var _workflowStateProvider = require('./swf/workflowStateProvider');

Object.defineProperty(exports, 'workflowStateProvider', {
  enumerable: true,
  get: function get() {
    return _workflowStateProvider.default;
  }
});

var _registerActivity = require('./swf/registerActivity');

Object.defineProperty(exports, 'registerActivity', {
  enumerable: true,
  get: function get() {
    return _registerActivity.default;
  }
});

var _boot = require('./boot/boot.js');

Object.defineProperty(exports, 'boot', {
  enumerable: true,
  get: function get() {
    return _boot.default;
  }
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _logger = require('./util/logger');

var _logger2 = _interopRequireDefault(_logger);

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