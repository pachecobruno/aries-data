import { createS3Client } from '../util/aws';

/**
 * Single S3 File Input
 * @param {Boolean} removeAfter - Remove file after processing.
 * @returns {Object} Result of decorated function.
 */
export default function singleS3FileInput() {
    // Return a decorator.
    return function (target, key, descriptor) {
        // Copy of the original function.
        const callback = descriptor.value;

        // Create s3 client.
        const client = createS3Client();

        // Return a new descriptor with our new wrapper function.
        return {
            ...descriptor,
            async value(activityTask, ...args) {
                // Skip everything if we don't have an input key.
                if (!(activityTask.input || {}).key) return;

                // Create params.
                const params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: activityTask.input.key,
                };

                // Download file.
                const response = await client.getObject(params);

                // Get a string.
                const fileString = response.Body.toString();

                // Merge parsed input object with file contents.
                const input = { ...activityTask.input, file: fileString };

                // Create new activityTask replacing the original input with the file.
                // const newActivityTask = activityTask.assign({ input });
                const newActivityTask = { input };

                // Create args for original function.
                const newArgs = [newActivityTask, ...args];

                // Return the result.
                const result = await callback.apply(this, newArgs);

                // Delete the input file.
                if (process.env.ARIES_REMOVE_FILES_AFTER_TASK) {
                    await client.deleteObject(params);
                    this.log.info(`Deleted ${params.Key}`);
                }
                return result; // eslint-disable-line consistent-return
            },
        };
    };
}
