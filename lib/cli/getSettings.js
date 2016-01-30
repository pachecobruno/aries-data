import assert from 'assert';

export default function getSettings(argv) {
    // Use command line args, then env vars.
    const settings = {
        domain: argv.domain || process.env.ARIES_DOMAIN,
        taskList: argv.tasklist || process.env.ARIES_TASKLIST,
        decider: argv.decider || process.env.ARIES_DECIDER,
        activities: argv.activities || process.env.ARIES_ACTIVITIES,
    };

    // Ensure we have valid settings to run.
    assert(settings.decider || settings.activities, 'A decider or actities must be specified');
    assert(settings.domain, 'A domain must be specified');
    assert(settings.taskList, 'A tasklist must be specified');

    // Return the settings.
    return settings;
};
