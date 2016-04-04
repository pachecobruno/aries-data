"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
    /**
     * Copy all incoming tasks properties to self.
     */

    function Task(task) {
        _classCallCheck(this, Task);

        Object.assign(this, task);
    }

    /**
     * Clone self, and apply any new props
     */


    _createClass(Task, [{
        key: "assign",
        value: function assign(props) {
            var proto = Object.getPrototypeOf(this);
            var clone = Object.assign(Object.create(proto), this);
            return Object.assign(clone, props);
        }
    }]);

    return Task;
}();

exports.default = Task;
;