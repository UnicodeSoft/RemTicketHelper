// Custom functions 💜
const { updateToDeleted } = require('../functions/sqlite.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {

        const guildId = channel.guildId;
        const channelId = channel.id;

        updateToDeleted(guildId, channelId);

        console.log(`[🎫] Ticket Eliminado (Forced way) | ID: ${channel.name}`);
    }
}