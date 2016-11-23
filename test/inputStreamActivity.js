import { Activity, singleS3StreamInput } from '../lib/index';

export default class MockActivity extends Activity {

    @singleS3StreamInput()
    async onTask(task, config, executionDate) {
        return 'result';
    }
};

