// Data
const config = require('../data/config.json');
const { template, footer } = require('../data/embeds.json');

// Internal functions
const { isTicket, getUserCreator, updateToClosed, getTicketCategory } = require('../functions/sqlite.js');

// Load Sentry Loggin resources
const Sentry = require("@sentry/node");
Sentry.init({ dsn: config.sentry.dsn, tracesSampleRate: 1.0 });

// DiscordJs
const { MessageActionRow, MessageButton } = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const guildId = message.guildId;
        const channelId = message.channelId;

        if(!isTicket(channelId, guildId)) {
            return;
        }

        const embed_closed = [{
            color: template.closed.color,
            title: template.closed.title,
            description: template.closed.description.replaceAll('{prefix_mention}', config.bot.prefix),
            footer: footer
        }];

        const btns_ticket_closed =  new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('reopen').setLabel('Reabrir Ticket').setStyle('SUCCESS'),
                new MessageButton().setCustomId('delete').setLabel('Eliminar Ticket').setStyle('DANGER')
            );
        message.reply({ embeds: embed_closed, components: [ btns_ticket_closed ] });

        updateToClosed(guildId, channelId);

        message.guild.channels.fetch(channelId).then( (channelEdit) => {
            var userCreator = getUserCreator(guildId, channelId);
            var menu_id = getTicketCategory(guildId, channelId);
            var category_info = Object.values(config.guilds[guildId]).flat().find(r => r.id === menu_id);

            if(category_info.allowed_staff.length > 0) {
                var allowed_staff = [
                    { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY' ] },
                    { id: message.guild.members.cache.get(userCreator), deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] },
                    { id: category_info.allowed_staff, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] },
                    { id: message.guild.members.cache.get(config.bot.clientId), allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES' ] }
                ];
            } else {
                var allowed_staff = [
                    { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY' ] },
                    { id: message.guild.members.cache.get(userCreator), deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] },
                    { id: message.guild.members.cache.get(config.bot.clientId), allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES' ] }
                ];
            }

            channelEdit.edit({
                permissionOverwrites: allowed_staff
            });
            console.log(`[🎫] Ticket Cerrado | Categoria: ${category_info.name} | ID: ${channelEdit.name}`);
        });
    } catch(error) {
        Sentry.withScope(function(scope) {
            scope.setTag('enviroment', 'production');
            scope.setTag('bot_project', 'remtickethelper');
            scope.setTag('error_type', 'try_catch');
            scope.setTag('file', 'close.js');
            scope.setLevel('error');
            Sentry.captureException(error);
        });
        console.error(error);
    }
}
