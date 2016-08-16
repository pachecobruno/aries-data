import { Activity } from '..';

export default class MockActivity extends Activity {

    static props = {
        name: 'bad-activity',
        version: '1.0.0',
    };

    async onTask(task, config, executionDate) {
        throw new Error(`I'm terrible!`);
    }
};

