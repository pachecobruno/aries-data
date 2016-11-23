import { Activity } from '../lib/index';

export default class MockActivity extends Activity {

    async onTask(task, config, executionDate) {
        throw new Error(`I'm terrible!`);
    }
};

