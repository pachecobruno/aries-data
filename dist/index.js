'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.setLogStreams = exports.createLogger = exports.singleS3StreamOutput = exports.singleS3StreamInput = exports.singleS3FileOutput = exports.singleS3FileInput = exports.Activity = exports.aws = undefined;

var _Activity = require('./Activity');

Object.defineProperty(exports, 'Activity', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Activity).default;
  }
});

var _singleS3FileInput = require('./decorators/singleS3FileInput');

Object.defineProperty(exports, 'singleS3FileInput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_singleS3FileInput).default;
  }
});

var _singleS3FileOutput = require('./decorators/singleS3FileOutput');

Object.defineProperty(exports, 'singleS3FileOutput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_singleS3FileOutput).default;
  }
});

var _singleS3StreamInput = require('./decorators/singleS3StreamInput');

Object.defineProperty(exports, 'singleS3StreamInput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_singleS3StreamInput).default;
  }
});

var _singleS3StreamOutput = require('./decorators/singleS3StreamOutput');

Object.defineProperty(exports, 'singleS3StreamOutput', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_singleS3StreamOutput).default;
  }
});

var _logger = require('./util/logger');

Object.defineProperty(exports, 'createLogger', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_logger).default;
  }
});
Object.defineProperty(exports, 'setLogStreams', {
  enumerable: true,
  get: function get() {
    return _logger.setLogStreams;
  }
});

var _logger2 = require('./decorators/logger');

Object.defineProperty(exports, 'logger', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_logger2).default;
  }
});

var _aws2 = require('./util/aws');

var _aws = _interopRequireWildcard(_aws2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.aws = _aws; /*
                     * Main entry point when imported.
                     * Export important modules.
                     */