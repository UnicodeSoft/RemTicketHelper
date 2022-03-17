// Data
const config = require('../data/config.json');

// Load Sentry Loggin resources
const Sentry = require("@sentry/node");
Sentry.init({ dsn: config.sentry.dsn, tracesSampleRate: 1.0 });

// Custom functions 💜
const { updateToDeleted, getTicketCategory } = require('../functions/sqlite.js');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        try {
            const guildId = channel.guildId;
            const channelId = channel.id;

            var menu_id = getTicketCategory(guildId, channelId);
            var category_info = Object.values(config.guilds[guildId]).flat().find(r => r.id === menu_id);

            updateToDeleted(guildId, channelId);

            console.log(`[🎫] Ticket Eliminado | Categoria: ${category_info.name} | ID: ${channel.name}`);            
        } catch (error) {
            console.error(error);
            Sentry.withScope(function(scope) {
                scope.setTag('enviroment', 'prod');
                scope.setTag('bot_project', 'remtickethelper');
                scope.setTag('error_type', 'errorHandler');
                scope.setTag('file', 'error.js');
                scope.setLevel('error');
                Sentry.captureException(error);
            });
        }
    }
}