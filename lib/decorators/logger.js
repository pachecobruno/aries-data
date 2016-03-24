import createLogger from '../util/logger';

export default function logger(name) {
    return function(target) {
        target.prototype.log = createLogger(name || target.name);
    };
};
