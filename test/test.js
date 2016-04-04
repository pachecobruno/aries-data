import test from 'blue-tape';
import Task from '../lib/swf/tasks/Task';
import ActivityTask from '../lib/swf/tasks/ActivityTask';

test('Task#assign', t => {
    const task = { input: '{ "key": "123" }' };
    const genericTask = new Task(task);
    const clone = genericTask.assign({ input: { key: '456' } });
    t.equal(clone.input.key, '456');
    t.ok(clone.assign);
    t.end();
});
