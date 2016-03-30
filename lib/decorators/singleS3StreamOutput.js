import { createS3Client } from '../util/aws';
import stringStream from 'string-to-stream';
import streamToPromise from 'stream-to-promise';
import S3S from 's3-streams';
import uuid from 'uuid';

export default function singleS3StreamOutput() {

    // Acting as a factory, return the decorator function.
    return function(target, key, descriptor) {
        // Copy of the original function.
        const callback = descriptor.value;

        return {
            ...descriptor,
            async value(...args) {
                // Run the original function which should return a write stream.
                const file = await callback.apply(this, args);

                // Return early if no file.
                if (!file) return;

                // Create a UUID for the filename.
                const key = uuid.v4();

                // Create upload params.
                const params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: key,
                };

                // Create read stream with the result.
                const readStream = stringStream(file);

                // Create a stream to write to s3.
                const writeStream = S3S.WriteStream(createS3Client(true), params);

                // Upload and wait for stream to finish.
                this.log.debug(`Streaming ${key} to s3.`);
                const result = await streamToPromise(readStream.pipe(writeStream));
                this.log.debug(`Successfully streamed ${key} to s3.`);

                // Return the filename.
                return key;
            },
        };
    };
};
