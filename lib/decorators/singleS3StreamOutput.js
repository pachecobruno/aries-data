import { createS3Client } from '../util/aws';
import streamToPromise from 'stream-to-promise';
import isString from 'lodash.isstring';
import S3S from 's3-streams';
import uuid from 'uuid';
import _ from 'highland';

/**
 * Apply split/json stringify transform streams.
 * @param {Object} source - read stream.
 * @param {Boolean/String} split - split on newlines and/or stringify json.
 */
export function applyTransforms(output, split) {
    // Wrap with highland.
    const readStream = _(output);

    // No transformations.
    if (!split) {
        return readStream;
    }

    // Add new lines between each chunk.
    if (split === true) {
        return readStream.intersperse('\n');
    }

    // Stringify emitted objects, and add new lines.
    if (split === 'json') {
        return readStream.map(JSON.stringify).intersperse('\n');
    }
};

/**
 * Single S3 Stream Output
 * @param {Boolean|String} split - Split the input on new lines and optionally parse.
 * @returns {Object} Json to locate the output file.
 */
export default function singleS3StreamOutput(split=false) {
    // Return a decorator.
    return function(target, key, descriptor) {
        // Copy of the original function.
        const callback = descriptor.value;

        // Return a new descriptor with our new wrapper function.
        return {
            ...descriptor,
            async value(...args) {
                // Run the original function which should return a readable stream.
                const output = await callback.apply(this, args);

                // Return early if no file.
                if (!output) return;

                // Create new string object if output is string literal.
                const source = isString(output) ? new String(output) : output;

                // Plug in our transformers if needed.
                const readStream = applyTransforms(source, split);

                // Location of s3 file.
                const s3Params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: uuid.v4(),
                };

                // Create write stream.
                const writeStream = S3S.WriteStream(createS3Client(true), s3Params);

                // Upload and wait for stream to finish.
                this.log.debug(`Streaming ${s3Params.Key} to s3.`);
                const result = await streamToPromise(readStream.pipe(writeStream));
                this.log.debug(`Successfully streamed ${s3Params.Key} to s3.`);

                // Return the filename.
                return { key: s3Params.Key };
            },
        };
    };
};
