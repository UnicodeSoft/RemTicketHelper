// Data
const config = require('../data/config.json');
const { template } = require('../data/embeds.json');

// Internal functions
const { isTicket, getUserCreator, updateToOpen, getTicketCategory } = require('../functions/sqlite.js');

// Load Sentry Loggin resources
const Sentry = require("@sentry/node");
Sentry.init({ dsn: config.sentry.dsn, tracesSampleRate: 1.0 });

exports.run = async (client, message, args) => {
    try {
        const guildId = message.guildId;
        const channelId = message.channelId;
        const categoryId = getTicketCategory(guildId, channelId);

        if(!isTicket(channelId, guildId)) {
            return;
        }

        const categoryInfo = Object.values(config.guilds[guildId]).flat().find(r => r.id === categoryId);
        const categoryStaff = categoryInfo.allowed_staff;

        const memberHasRole = message.member.roles.cache
            .filter((role) => categoryStaff.includes(role.id))
            .map((role) => role.id);

        if(categoryStaff.length > 0 && memberHasRole.length == 0) {
            return message.reply('Solo el staff puede agregar usuarios al ticket.');
        }

        if(args.length == 0) {
            return message.reply('Debes mencionar el ID de los usuarios por agregar.');
        }

        const userToAdd = [];
        args.forEach((user) => {
            if(!isNaN(user)) {
                var get_user = message.guild.members.fetch(user);
                if(typeof get_user === 'undefined') {
                    message.reply("No se ha encontrado al usuario con el ID `"+user+"` en este Discord.");
                } else {
                    userToAdd.push(user);
                }
            }
        });

        var userCreator = getUserCreator(guildId, channelId);

        var permissions = [
            { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY' ] },
            { id: config.bot.clientId, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES' ] },
            { id: userCreator, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] }
        ];

        if(categoryStaff.length > 0) {
            categoryStaff.forEach(staff => {
                permissions.push({ id: staff, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] });
            });
        }

        // toDo :: add users

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