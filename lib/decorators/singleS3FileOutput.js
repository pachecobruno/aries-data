import uuid from 'uuid';
import { createS3Client } from '../util/aws';
import ensureNewline from 'single-trailing-newline';

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
            async value(...args) {
                // Get the value of the function we are wrapping.
                const file = await callback.apply(this, args);

                // Return early if no file.
                if (!file) return;

                // Create a UUID for the filename.
                const key = uuid.v4();

                // Create upload params.
                const params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: key,
                    Body: ensureNewline(file),
                };

                // Upload the file.
                this.log.debug(`Uploading ${key} to s3.`);
                const response = await client.upload(params);
                this.log.debug(`Successfully uploaded ${key}.`);

                // Return the filename.
                return { key };
            },
        };
    };
};
