import thenify from 'thenify-all';
import uuid from 'uuid';
import { createS3Client } from '../util/aws';

export default function singleS3FileOutput() {

    // Acting as a factory, return the decorator function.
    return function(target, key, descriptor) {
        // Copy of the original function.
        const callback = descriptor.value;

        // Create s3 client.
        const client = createS3Client();

        // Return a new descriptor with our wrapper function.
        return {
            ...descriptor,
            async value() {
                // Get the value of the function we are wrapping.
                const file = await callback.apply(this, arguments);

                // Return early if no file.
                if (!file) return;

                // Create a UUID for the filename.
                const key = uuid.v4();

                // Create upload params.
                const params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: key,
                    Body: file,
                };

                // Upload the file.
                const response = await client.upload(params);
                this.log.info(`Successfully uploaded ${key}.`);

                // Return the filename.
                return key;
            },
        };
    };
};
