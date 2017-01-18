import uuid from 'uuid';
import { createS3Client } from '../util/aws';

export default function singleS3FileOutput() {
    // Acting as a factory, return the decorator function.
    return function (target, key, descriptor) {
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

                // Create upload params.
                const s3Params = {
                    Bucket: process.env.AWS_S3_TEMP_BUCKET,
                    Key: uuid.v4(),
                    Body: file,
                };

                // Upload the file.
                this.log.debug(`Uploading ${s3Params.Key} to s3.`);
                // eslint-disable-next-line no-unused-vars
                const response = await client.upload(s3Params);
                this.log.debug(`Successfully uploaded ${s3Params.Key}.`);

                // Return the filename.
                return { key: s3Params.Key }; // eslint-disable-line consistent-return
            },
        };
    };
}
