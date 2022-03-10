// Custom functions 💜
const { updateToDeleted } = require('../functions.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {

        const guildId = channel.guildId;
        const channelId = channel.id;

        updateToDeleted(guildId, channelId);
    }
}