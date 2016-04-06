import { Readable } from 'stream';
import { createS3Client } from '../util/aws';
import streamToPromise from 'stream-to-promise';
import isString from 'lodash.isstring';
import S3S from 's3-streams';
import uuid from 'uuid';
import _ from 'highland';

// Pipe readstream through required transformers.
export function applyTransforms(source, split) {
    // Wrap with highland.
    const readStream = _(source);

    // Apply transformations.
    if (!split) return readStream;
    if (split === true) return readStream.intersperse('\n');
    if (split === 'json') return readStream.map(JSON.stringify).intersperse('\n');
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

                // Create a UUID for the filename.
                const key = uuid.v4();

                // Create upload params.
                const params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: key,
                };

                // Create a stream to write to s3.
                const writeStream = S3S.WriteStream(createS3Client(true), params);

                // Plug in our transformers if needed.
                const stream = applyTransforms(source, split);

                // Upload and wait for stream to finish.
                this.log.debug(`Streaming ${key} to s3.`);
                const result = await streamToPromise(stream.pipe(writeStream));
                this.log.debug(`Successfully streamed ${key} to s3.`);

                // Return the filename.
                return { key };
            },
        };
    };
};
