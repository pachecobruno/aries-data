export default function jsonInput() {

    // Acting as a factory, return the decorator function.
    return function(target, key, descriptor) {
        // Copy of original function.
        const callback = descriptor.value;

        // Return a new descriptor with our wrapper function.
        return {
            ...descriptor,
            async value(activityTask, ...args) {
                // Parse the input into an object.
                const input = JSON.parse(activityTask.input);

                // Create a clone with new input.
                const newActivityTask = { ...activityTask, input };

                // New array of args to apply to original function.
                const newArgs = [newActivityTask, ...args];

                // Apply new args to original function.
                const result = await callback.apply(this, newArgs);

                // Return the result of the original function.
                return result;
            },
        };
    };
};
