// Data
const config = require('../data/config.json');
const { template } = require('../data/embeds.json');

// Internal functions
const { isTicket, getUserCreator, updateToOpen, getTicketCategory } = require('../functions/sqlite.js');

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

        const embed_user_added = [{
            color: template.reopened.color,
            title: template.reopened.title,
            description: template.reopened.description
        }];

        message.reply({ embeds: embed_user_added });

        updateToOpen(guildId, channelId);

        await wait(750);

        message.guild.channels.fetch(channelId).then( (channelEdit) => {
            var userCreator = getUserCreator(guildId, channelId);
            var menu_id = getTicketCategory(guildId, channelId);
            var category_info = Object.values(config.guilds[guildId]).flat().find(r => r.id === menu_id);

            var permissions = [
                { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY' ] },
                { id: config.bot.clientId, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES' ] },
                { id: userCreator, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] }
            ];

            if(category_info.allowed_staff.length > 0) {
                category_info.allowed_staff.forEach(staff => {
                    permissions.push({ id: staff, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] });
                });
            }

            message.guild.channels.fetch(channelId).edit({
                permissionOverwrites: permissions
            });
            console.log(`[🎫] Ticket Reabierto | Categoria: ${category_info.name} | ID: ${channelEdit.name}`);
        });
    } catch(error) {
        Sentry.withScope(function(scope) {
            scope.setTag('enviroment', 'production');
            scope.setTag('bot_project', 'remtickethelper');
            scope.setTag('error_type', 'try_catch');
            scope.setTag('file', 'reopen.js');
            scope.setLevel('error');
            Sentry.captureException(error);
        });
        console.error(error);
    }
}