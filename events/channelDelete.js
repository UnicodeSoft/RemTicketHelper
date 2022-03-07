// Custom functions 💜
const { updateTicketToClosed } = require('../functions.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {

        const guildId = channel.guildId;
        const categoryId = channel.parentId;
        const channelId = channel.id;

        updateTicketToClosed(guildId, categoryId, channelId);
    }
}