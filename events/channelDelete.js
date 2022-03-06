const config = require('../data/config.json');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {

        // buscar por categoría... si existe en los que administra el bot, procesar como eliminado...
        const category = channel.parentId;
        const channelId = channel.id;

    }
}