'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stampit = require('stampit');

var _stampit2 = _interopRequireDefault(_stampit);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _stampit2.default.convertConstructor(_events2.default.EventEmitter);