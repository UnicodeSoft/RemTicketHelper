// Data
const config = require('../data/config.json');
const { template, footer } = require('../data/embeds.json');
const { isTicket, getUserCreator, updateToOpen, getCurTicketId, getTicketCategory } = require('../functions.js');

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

        const embed_reopen = [{
            color: 0xcc3366,
            title: template.reopened.title,
            description: template.reopened.description,
            footer: footer
        }];

        const btns_ticket_reopen =  new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('close').setLabel('Cerrar Ticket').setStyle('DANGER')
            );
        message.reply({ embeds: embed_reopen, components: [ btns_ticket_reopen ] });

        updateToOpen(guildId, channelId);

        await wait(750);

        message.guild.channels.fetch(channelId).then( (channelEdit) => {
            var userCreator = getUserCreator(guildId, channelId);
            var menu_id = getTicketCategory(guildId, channelId);
            var category_info = Object.values(config.guilds[guildId]).flat().find(r => r.id === menu_id);

            if(category_info.allowed_staff.length > 0) {
                var allowed_staff = [
                    { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY' ] },
                    { id: message.guild.members.cache.get(userCreator), allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] },
                    { id: category_info.allowed_staff, allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] }
                ];
            } else {
                var allowed_staff = [
                    { id: message.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY' ] },
                    { id: message.guild.members.cache.get(userCreator), allow: [ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES' ] }
                ];
            }

            message.guild.channels.fetch(channelId).edit({
                permissionOverwrites: allowed_staff
            });
        });
    } catch(error) {
        console.log(error);
    }
}