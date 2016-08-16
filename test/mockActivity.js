import { Activity } from '..';

export default class MockActivity extends Activity {

    static props = {
        name: 'mock-activity',
        version: '1.0.0',
    };

    async onTask(task, config, executionDate) {
        return await new Promise((resolve, reject) => {
            setTimeout(resolve.bind(null, 'result'), 1000);
        });
    }
};
