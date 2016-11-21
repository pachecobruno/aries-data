import { createS3Client } from '../util/aws';
import s3DownloadStream from 's3-download-stream';
import _ from 'highland';

/**
 * Apply split/json parsing transform streams.
 * @param {Object} source - read stream.
 * @param {Boolean/String} split - split on newlines and/or parse json.
 */
export function applyTransforms(source, split) {
    // Wrap with highland.
    const readStream = _(source);

    // No transformations.
    if (!split) {
        return readStream;
    }

    // Split on new lines.
    if (split === true) {
        return readStream.split();
    }

    // Split on new lines, then parse individual lines into objects.
    // Ignore errors - typically caused by trailing new lines in input.
    if (split === 'json') {
        return readStream.split().map(JSON.parse).errors(err => {});
    }
};

/**
 * Single S3 Stream Input
 * @param {Boolean|String} split - Split the input on new lines and optionally parse.
 * @param {Boolean} removeAfter - Remove file after we finish processing.
 * @returns {Object} Json to locate the output file.
 */
export default function singleS3StreamInput(split=false) {
    // Return a decorator.
    return function(target, key, descriptor) {
        // Copy of the original function.
        const callback = descriptor.value;

        // Return a new descriptor with our new wrapper function.
        return {
            ...descriptor,
            async value(activityTask, ...args) {
                // Skip everything if we don't have an input key.
                if (!(activityTask.input || {}).key) return;

                // Location of s3 file.
                const s3Params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: activityTask.input.key,
                };

                // Create S3 client.
                const client = createS3Client();

                // Check if file is zero lenth.
                const head = await client.headObject(s3Params);
                if (head.ContentLength === 0) return;

                // Get a read stream to the source.
                const readStream = s3DownloadStream({
                    client: createS3Client(false),
                    concurrency: 6,
                    params: s3Params,
                });

                // Split chunks by newlines if required.
                const stream = applyTransforms(readStream, split);

                // Merge parsed input object with a file stream.
                const input = { ...activityTask.input, file: stream };

                // Create new activityTask replacing the original input with the file.
                // const newActivityTask = activityTask.assign({ input });
                const newActivityTask = { input };

                // Create args for original function.
                const newArgs = [newActivityTask, ...args];

                // Return the result.
                const result = await callback.apply(this, newArgs);

                // Delete the input file.
                if (process.env.ARIES_REMOVE_FILES_AFTER_TASK) {
                    const client = createS3Client();
                    await client.deleteObject(s3Params);
                    this.log.info(`Deleted ${s3Params.Key}`);
                }

                return result;
            },
        };
    };
};
