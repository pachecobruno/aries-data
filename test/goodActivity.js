import { Activity } from '../lib/index';

export default class MockActivity extends Activity {

    async onTask(task, config, executionDate) {
        return await new Promise((resolve, reject) => {
            setTimeout(resolve.bind(null, 'result'), 1000);
        });
    }
};
