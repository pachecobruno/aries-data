import { createS3Client } from '../util/aws';
import S3S from 's3-streams';

export default function singleS3StreamInput(removeAfter) {

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
                    Key: activityTask.input,
                };

                // Create a stream to source file.
                const input = S3S.ReadStream(createS3Client(true), params);

                // Create new activityTask replacing the original input with the file.
                const newActivityTask = { ...activityTask, input };

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

