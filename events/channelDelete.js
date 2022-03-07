// Custom functions 💜
const { updateTicketToDeleted } = require('../functions.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {

        const guildId = channel.guildId;
        const categoryId = channel.parentId;
        const channelId = channel.id;

        updateTicketToDeleted(guildId, categoryId, channelId);
    }
}