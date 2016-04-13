import fs from 'fs';
import nock from 'nock';
import trimEnd from 'lodash.trimend';
import validator from 'validator';
import logger from '../../decorators/logger';
import ActivityTask from '../../swf/tasks/ActivityTask';

@logger()
export default class ActivityTester {
    static FAKE_BUCKET = 'wormhole';

    constructor(Activity) {
        // Set a fake env var.  Kinda weird, fix me, or not.
        process.env.AWS_S3_TEMP_BUCKET = ActivityTester.FAKE_BUCKET;

        // Set the activity class.
        this.activity = new Activity();
    }

    _s3Scope() {
        return nock(`https://${ActivityTester.FAKE_BUCKET}.s3.amazonaws.com`);
    }

    _interceptS3Input(file, method) {
        this._s3Scope()
            .filteringPath(path => '/infile')

            // GET /infile
            .get('/infile')
            .reply(200, fs[method].bind(fs, file, { encoding: 'utf-8' }))

            // DELETE /infile
            .delete('/infile')
            .reply(200);
    }

    interceptS3FileInput(file) {
        return this._interceptS3Input(file, 'readFileSync');
    }

    interceptS3StreamInput(file) {
        return this._interceptS3Input(file, 'createReadStream');
    }

    testS3StreamOutput(file, test) {
        // Sample response strings from s3 docs.
        const uploadId =
            'VXBsb2FkIElEIGZvciA2aWWpbmcncyBteS1tb3ZpZS5tMnRzIHVwbG9hZA';

        const postResponse =
            `<?xml version="1.0" encoding="UTF-8"?>` +
            `<InitiateMultipartUploadResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">` +
              `<Bucket>hubble</Bucket>` +
              `<Key>test</Key>` +
              `<UploadId>${uploadId}</UploadId>` +
            `</InitiateMultipartUploadResult>`;

        this._s3Scope()
            .filteringPath(path => {
                // If the resource is a UUID, replace with filename.
                const resource = path.slice(1, path.indexOf('?'));
                return validator.isUUID(resource) ? '/outfile' : path;
            })

            // POST /outfile
            .post('/outfile')
            .query({ uploads: '' })
            .reply(200, postResponse)

            // PUT /outfile
            .put('/outfile')
            .query({ partNumber: 1, uploadId })
            .reply(200, (uri, actual) => {
                const expected = trimEnd(fs.readFileSync(file).toString());
                test(actual, expected);
            })

            // POST /outfile
            .post('/outfile')
            .query({ uploadId })
            .reply(200)
    }

    async onTask(activityTask, ...args) {
        const task = new ActivityTask(activityTask);
        const newArgs = [task, ...args];
        return await this.activity.onTask.apply(this.activity, newArgs);
    }
};
