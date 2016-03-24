import createLogger from '../util/logger';

export default function logger() {
    return function(target) {
        console.log(target);
        target.prototype.log = createLogger(target.name);
    };
};
