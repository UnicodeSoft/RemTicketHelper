// Data
const config = require('../data/config.json');
const { template } = require('../data/embeds.json');

// Internal functions
const { isTicket, getUserCreator, getTicketCategory, addParticipant } = require('../functions/sqlite.js');

// Load Sentry Loggin resources
const Sentry = require("@sentry/node");
Sentry.init({ dsn: config.sentry.dsn, tracesSampleRate: 1.0 });

exports.run = async (client, message, args) => {
    try {
        const guildId = message.guildId;
        const channelId = message.channelId;
        const categoryId = getTicketCategory(guildId, channelId);
        var userToAdd = args.join('');

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

        if(isNaN(userToAdd)) {
            return message.reply("❌ `"+userToAdd+"` no es un ID válido.");
        }

        if(userToAdd.length != '18') {
            return message.reply("El ID `"+userToAdd+"` tiene una longitud no válida. (Debe ser 18 de caracteres)");
        }

        userToAdd = await message.guild.members.fetch(userToAdd).catch((error) => {
            message.reply("El usuario con ID `"+userToAdd+"` no se encuentra en el Discord.");
            return;
        });
        if(typeof userToAdd === 'undefined') { return; }

        await message.guild.channels.fetch(channelId).then((channelEdit) => {
            var userCreator = getUserCreator(guildId, channelId);

            var permissions = [
                { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY' ] },
                { id: config.bot.clientId, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES' ] },
                { id: userCreator, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] },
                { id: userToAdd.user.id, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] } // meter en loop
            ];
    
            if(categoryStaff.length > 0) {
                categoryStaff.forEach(staff => {
                    permissions.push({ id: staff, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] });
                });
            }

            channelEdit.edit({
                permissionOverwrites: permissions
            });

            addParticipant(guildId, channelId, userToAdd.user.id);

            message.reply(`<@${userToAdd.user.id}> ha sido agregado al ticket!`);

        }).catch((error) => {
            Sentry.withScope(function(scope) {
                scope.setTag('enviroment', 'production');
                scope.setTag('bot_project', 'remtickethelper');
                scope.setTag('error_type', 'channelEdit');
                scope.setTag('file', 'adduser.js');
                scope.setLevel('error');
                Sentry.captureException(error);
            });
            console.log('channelEdit', error);
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
        console.error('try', error);
    }
}