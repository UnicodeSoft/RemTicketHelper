// Data
const config = require('../data/config.json');
const { template, footer } = require('../data/embeds.json');

// Internal functions
const { isTicket, updateToDeleted, getTicketCategory } = require('../functions/sqlite.js');

// Load Sentry Loggin resources
const Sentry = require("@sentry/node");
Sentry.init({ dsn: config.sentry.dsn, tracesSampleRate: 1.0 });

// Other Dependencies
const wait = require('node:timers/promises').setTimeout;

exports.run = async (client, message, args) => {
    try {
        const guildId = message.guildId;
        const channelId = message.channelId;

        if(!isTicket(channelId, guildId)) {
            return;
        }

        const sec = config.bot.secDelTicket;

        const embed_delete = [{
            color: template.delete.color,
            title: template.delete.title,
            description: template.delete.description.replaceAll('{seconds}', sec),
            footer: footer
        }];
        message.reply({ embeds: embed_delete });

        await wait(sec * 1000);

        const toDelete = message.guild.channels.cache.get(channelId);

        updateToDeleted(toDelete.guildId, toDelete.id);

        var menu_id = getTicketCategory(guildId, channelId);
        var category_info = Object.values(config.guilds[guildId]).flat().find(r => r.id === menu_id);

        console.log(`[🎫] Ticket Eliminado | Categoria: ${category_info.name} ID: ${toDelete.name}`);

        toDelete.delete();
    } catch(error) {
        console.error(error);
        Sentry.withScope(function(scope) {
            scope.setTag('enviroment', 'prod');
            scope.setTag('bot_project', 'remtickethelper');
            scope.setTag('error_type', 'try_catch');
            scope.setTag('file', 'delete.js');
            scope.setLevel('error');
            Sentry.captureException(error);
        });
    }
}