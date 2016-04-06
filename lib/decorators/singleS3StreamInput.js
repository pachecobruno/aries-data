import { createS3Client } from '../util/aws';
import S3S from 's3-streams';
import _ from 'highland';

// Pipe readstream through required transformers.
export function applyTransforms(source, split) {
    // Wrap with highland.
    const readStream = _(source);

    // Apply transformations.
    if (!split) return readStream;
    if (split === true) return readStream.split();
    if (split === 'json') return readStream.split().map(JSON.parse);
};

/**
 * Single S3 Stream Input
 * @param {Boolean|String} split - Split the input on new lines and optionally parse.
 * @param {Boolean} removeAfter - Remove file after we finish processing.
 * @returns {Object} Json to locate the output file.
 */
export default function singleS3StreamInput(split=false, removeAfter=true) {
    // Return a decorator.
    return function(target, key, descriptor) {
        // Copy of the original function.
        const callback = descriptor.value;

        // Return a new descriptor with our new wrapper function.
        return {
            ...descriptor,
            async value(activityTask, ...args) {
                // Create params.
                const params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: activityTask.input.key,
                };

                // Create a stream to source file.
                const source = S3S.ReadStream(createS3Client(true), params);

                // Split chunks by newlines if required.
                const stream = applyTransforms(source, split);

                // Merge parsed input object with a file stream.
                const input = { ...activityTask.input, file: stream };

                // Create new activityTask replacing the original input with the file.
                const newActivityTask = activityTask.assign({ input });

                // Create args for original function.
                const newArgs = [newActivityTask, ...args];

                // Return the result.
                const result = await callback.apply(this, newArgs);

                // Delete the input file.
                if (removeAfter) {
                    const client = createS3Client();
                    await client.deleteObject(params);
                    this.log.info(`Deleted ${params.Key}`);
                }

                return result;
            },
        };
    };
};

