import { createS3Client } from '../util/aws';
import createLogger from '../util/createLogger';

export default function singleS3FileInput(removeAfter) {

    // Acting as a factory, return the decorator function.
    return function(target, key, descriptor) {
        // Copy of the original function.
        const callback = descriptor.value;

        // Create s3 client.
        const client = createS3Client();

        // Return a new descriptor with our new wrapper function.
        return {
            ...descriptor,
            async value(activityTask, ...args) {
                // Create params.
                const params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: activityTask.input,
                };

                // Download file.
                const response = await client.getObject(params);

                // Get a string.
                const input = response.Body.toString();

                // Create new activityTask replacing the original input with the file.
                const newActivityTask = { ...activityTask, input };

                // Create args for original function.
                const newArgs = [newActivityTask, ...args];

                // Return the result.
                const result = await callback.apply(this, newArgs);

                // Delete the input file.
                if (removeAfter) {
                    await client.deleteObject(params);
                    this.log.info(`Deleted ${params.Key}`);
                }

                return result;
            },
        };
    };
};
