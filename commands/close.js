// Data
const config = require('../data/config.json');
const { template, footer } = require('../data/embeds.json');
const { isTicket, getUserCreator, updateToClosed, getCurTicketId, getTicketCategory } = require('../functions.js');

// DiscordJs
const { MessageActionRow, MessageButton } = require('discord.js');

// This thing...
const wait = require('node:timers/promises').setTimeout;

exports.run = async (client, message, args) => {
    try {
        const guildId = message.guildId;
        const channelId = message.channelId;

        if(!isTicket(channelId, guildId)) {
            return;
        }

        const embed_closed = [{
            color: 0xcc3366,
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
                    { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                    { id: message.guild.members.cache.get(userCreator), deny: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] },
                    { id: category_info.allowed_staff, allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                ];
            } else {
                var allowed_staff = [
                    { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                    { id: message.guild.members.cache.get(userCreator), deny: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                ];
            }

            console.log(channelEdit);

            channelEdit.edit({
                permissionOverwrites: allowed_staff
            });
        });
    } catch(error) {
        console.log(error);
    }
}