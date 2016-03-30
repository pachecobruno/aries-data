export default function jsonOutput() {

    // Acting as a factory, return the decorator function.
    return function(target, key, descriptor) {
        // Copy of original function.
        const callback = descriptor.value;

        // Return a new descriptor with our wrapper function.
        return {
            ...descriptor,
            async value(...args) {
                // Get the value of the function we are wrapping.
                const result = await callback.apply(this, args);

                // Return early if no result.
                if (!result) return;

                // Stringify the returned object.
                const str = JSON.stringify(result);

                // Return the string.
                return str;
            },
        };
    };
};
