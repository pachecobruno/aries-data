'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nock = require('nock');

var _nock2 = _interopRequireDefault(_nock);

var _lodash = require('lodash.trimend');

var _lodash2 = _interopRequireDefault(_lodash);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _logger = require('../../decorators/logger');

var _logger2 = _interopRequireDefault(_logger);

var _ActivityTask = require('../../swf/tasks/ActivityTask');

var _ActivityTask2 = _interopRequireDefault(_ActivityTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActivityTester = (_dec = (0, _logger2.default)(), _dec(_class = (_temp = _class2 = function () {
    function ActivityTester(Activity) {
        _classCallCheck(this, ActivityTester);

        // Set a fake env var.  Kinda weird, fix me, or not.
        process.env.AWS_S3_TEMP_BUCKET = ActivityTester.FAKE_BUCKET;

        // Set the activity class.
        this.activity = new Activity();
    }

    _createClass(ActivityTester, [{
        key: '_s3Scope',
        value: function _s3Scope() {
            return (0, _nock2.default)('https://' + ActivityTester.FAKE_BUCKET + '.s3.amazonaws.com');
        }
    }, {
        key: '_interceptS3Input',
        value: function _interceptS3Input(file, method) {
            this._s3Scope().filteringPath(function (path) {
                return '/infile';
            })

            // GET /infile
            .get('/infile').reply(200, _fs2.default[method].bind(_fs2.default, file, { encoding: 'utf-8' }))

            // DELETE /infile
            .delete('/infile').reply(200);
        }
    }, {
        key: 'interceptS3FileInput',
        value: function interceptS3FileInput(file) {
            return this._interceptS3Input(file, 'readFileSync');
        }
    }, {
        key: 'interceptS3StreamInput',
        value: function interceptS3StreamInput(file) {
            return this._interceptS3Input(file, 'createReadStream');
        }
    }, {
        key: 'testS3StreamOutput',
        value: function testS3StreamOutput(file, test) {
            // Sample response strings from s3 docs.
            var uploadId = 'VXBsb2FkIElEIGZvciA2aWWpbmcncyBteS1tb3ZpZS5tMnRzIHVwbG9hZA';

            var postResponse = '<?xml version="1.0" encoding="UTF-8"?>' + '<InitiateMultipartUploadResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' + '<Bucket>hubble</Bucket>' + '<Key>test</Key>' + ('<UploadId>' + uploadId + '</UploadId>') + '</InitiateMultipartUploadResult>';

            this._s3Scope().filteringPath(function (path) {
                // If the resource is a UUID, replace with filename.
                var resource = path.slice(1, path.indexOf('?'));
                return _validator2.default.isUUID(resource) ? '/outfile' : path;
            })

            // POST /outfile
            .post('/outfile').query({ uploads: '' }).reply(200, postResponse)

            // PUT /outfile
            .put('/outfile').query({ partNumber: 1, uploadId: uploadId }).reply(200, function (uri, actual) {
                var expected = (0, _lodash2.default)(_fs2.default.readFileSync(file).toString());
                test(actual, expected);
            })

            // POST /outfile
            .post('/outfile').query({ uploadId: uploadId }).reply(200);
        }
    }, {
        key: 'onTask',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(activityTask) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                var task, newArgs;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                task = new _ActivityTask2.default(activityTask);
                                newArgs = [task].concat(args);
                                _context.next = 4;
                                return this.activity.onTask.apply(this.activity, newArgs);

                            case 4:
                                return _context.abrupt('return', _context.sent);

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function onTask(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return onTask;
        }()
    }]);

    return ActivityTester;
}(), _class2.FAKE_BUCKET = 'wormhole', _temp)) || _class);
exports.default = ActivityTester;
;