import _ from 'highland';
import isString from 'lodash.isstring';
import uuid from 'uuid';
import { PassThrough } from 'stream';
import meter from 'stream-meter';
import { createS3Client } from '../util/aws';

/**
 * Apply split/json stringify transform streams.
 * @param {Object} source - read stream.
 * @param {Boolean/String} split - split on newlines and/or stringify json.
 */
export function applyTransforms(output, split) {
    // Wrap with highland.
    const readStream = _(output);

    // Add new lines between each chunk.
    if (split === true) {
        return readStream.intersperse('\n');
    }

    // Stringify emitted objects, and add new lines.
    if (split === 'json') {
        return readStream.map(JSON.stringify).intersperse('\n');
    }
    return readStream;
}

/**
 * Single S3 Stream Output
 * @param {Boolean|String} split - Split the input on new lines and optionally parse.
 * @returns {Object} Json to locate the output file.
 */
export default function singleS3StreamOutput(split = false) {
    // Return a decorator.
    return function (target, key, descriptor) {
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
                // highland does not accept a single string literal argument.
                // Must be a String object.
                // eslint-disable-next-line no-new-wrappers
                const source = isString(output) ? new String(output) : output;

                // get meter stream to count bytes in stream
                const streamCounter = meter();

                // handle the 'finish' event emitted by meter stream so we can log out the bytes
                // TODO: associate bytes with an appId
                streamCounter.on('finish', () => {
                    this.log.info({ totalBytesOut: streamCounter.bytes });
                    this.log.info({ totalRecordsOut: streamCounter.recordCount });
                });

                // Plug in our transformers if needed.
                const readStream = applyTransforms(source, split);

                // Location of s3 file.
                const s3Params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: uuid.v4(),
                    Body: readStream.pipe(streamCounter).pipe(new PassThrough()),
                };

                const s3Options = {
                    partSize: 5 * 1024 * 1024,
                    queueSize: 5,
                };

                // Upload and wait for stream to finish.
                this.log.debug(`Streaming ${s3Params.Key} to s3.`);

                // eslint-disable-next-line no-unused-vars
                const result = await new Promise((resolve, reject) => {
                    // Get a new s3 client.
                    const s3 = createS3Client();
                    let streamError = null;

                    // Start upload.
                    const managedUpload = s3.upload(s3Params, s3Options, (err, data) => {
                        if (streamError) return reject(streamError);
                        if (err) return reject(err);
                        return resolve(data);
                    });

                    // Watch for input errors, and abort if we have one.
                    readStream.on('error', (err) => {
                        streamError = err;
                        managedUpload.abort();
                    });
                });

                this.log.debug(`Successfully streamed ${s3Params.Key} to s3.`);

                // Return the filename.
                return { key: s3Params.Key }; // eslint-disable-line consistent-return
            },
        };
    };
}
