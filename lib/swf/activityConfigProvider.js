import stampit from 'stampit';

/**
 * Activity Configuration Provider.
 * Responsible for supplying configuration information (if any)
 * Default implementation returns a configuration object that
 * this provider was created with.
 * For example: activityConfigProvier({ config: { setting: 'value' }});
 */
export default stampit.methods({
    async getConfig(task) {
        if (this.config) return this.config;
        return {};
    },
});
