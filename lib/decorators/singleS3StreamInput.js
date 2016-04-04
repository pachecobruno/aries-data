import { createS3Client } from '../util/aws';
import S3S from 's3-streams';
import split2 from 'split2';
import map from 'through2-map';

export function transformer(readStream, splitChunks) {
    if (splitChunks === true) {
        return readStream.pipe(split2());
    } else if (splitChunks === 'json') {
        return readStream.pipe(split2()).pipe(map.obj(JSON.parse));
    }
};

export default function singleS3StreamInput(splitChunks=false, removeAfter=false) {
    // Acting as a factory, return the decorator function.
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
                const readStream = S3S.ReadStream(createS3Client(true), params);

                // Split chunks by newlines if required.
                const stream = splitChunks
                    ? transformer(readStream, splitChunks)
                    : readStream;

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

