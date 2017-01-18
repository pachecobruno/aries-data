import createLogger from '../util/logger';

export default function (name) {
    return function decorator(target) {
        const original = target;

        const ctor = function (...args) {
            this.log = createLogger(name || original.name);
            return original.apply(this, args);
        };

        ctor.prototype = original.prototype;

        return ctor;
    };
}
