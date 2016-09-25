import { Activity, singleS3StreamInput } from '../lib/index';

export default class MockActivity extends Activity {

    static props = {
        name: 'input-stream-activity',
        version: '1.0.0',
    };

    @singleS3StreamInput()
    async onTask(task, config, executionDate) {
        return 'result';
    }
};

