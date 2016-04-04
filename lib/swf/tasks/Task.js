export default class Task {
    /**
     * Copy all incoming tasks properties to self.
     */
    constructor(task) {
        Object.assign(this, task);
    }

    /**
     * Clone self, and apply any new props
     */
    assign(props) {
        const proto = Object.getPrototypeOf(this);
        const clone = Object.assign(Object.create(proto), this);
        return Object.assign(clone, props);
    }
};
