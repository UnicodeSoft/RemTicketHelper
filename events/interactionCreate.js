// Data
const config = require('../data/config.json');
const { template, footer } = require('../data/embeds.json');

// Custom functions 💜
const {
    userTicketsOnCat,
    getNewTicketId,
    saveNewTicket,
    isTicket,
    updateToDeleted,
    updateToClosed,
    updateToOpen,
    getCurTicketId,
    getUserCreator,
    getTicketCategory
} = require('../functions.js');

// DiscordJs
const { MessageActionRow, MessageButton } = require('discord.js');

// This thing...
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'interactionCreate',
    async execute(int) {

        // 📘 Datos Necesarios
        const guild = int.guildId;
        const channel = int.channelId;
        const user = int.user.id;

        switch(int.componentType) {
            case 'SELECT_MENU':
                var menu_id = int.values[0];

                var category_info = Object.values(config.guilds[guild]).flat().find(r => r.id === menu_id);
                const total_open = userTicketsOnCat(user, guild, menu_id);

                const embed_content = [{
                    color: 0xcc3366,
                    title: template.main_embed.title,
                    description: template.main_embed.description,
                    footer: footer
                }];

                await int.deferUpdate();

                await wait(500);

                await int.editReply({ embeds: embed_content, ephemeral: true });

                if(total_open >= category_info.limit) {
                    return await int.followUp({
                        content: "🎫 No se puede crear el ticket porque has alcanzado el límite de tickets abiertos en esta categoría...",
                        ephemeral: true
                    });
                }

                await int.followUp({
                    content: "🎫 El ticket está siendo creado...",
                    ephemeral: true
                });

                if(category_info.allowed_staff.length > 0) {
                    var allowed_staff = [
                        { id: int.member.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                        { id: int.guild.members.cache.get(user), allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] },
                        { id: category_info.allowed_staff, allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                    ];
                } else {
                    var allowed_staff = [
                        { id: int.member.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                        { id: int.guild.members.cache.get(user), allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                    ];
                }

                const newTicketId = getNewTicketId(guild, menu_id);

                int.guild.channels.create(`ticket-${newTicketId}`, {
                    type: 'text',
                    parent: category_info.id,
                    permissionOverwrites: allowed_staff
                }).then(async (newChannel) => {
                    saveNewTicket(guild, category_info.id, newChannel.id, user);

                    await int.followUp({
                        content: `🎫 Tu ticket se ha creado: <#${newChannel.id}>`,
                        ephemeral: true
                    });

                    const embed_welcome = [{
                        color: 0xcc3366,
                        title: template.new.title.replaceAll('{catname_mention}', category_info.name),
                        description: template.new.description.replaceAll('{prefix_mention}', config.bot.prefix),
                        footer: footer
                    }];

                    const btns_ticket =  new MessageActionRow()
                        .addComponents(
                            new MessageButton().setCustomId('close').setLabel('Cerrar Ticket').setStyle('DANGER')
                        );

                    newChannel.send({ content: `Hola <@${user}>!`, embeds: embed_welcome, components: [ btns_ticket ] });
                });
            break;
            /* ============================================================================================================================== */
            case 'BUTTON': // Botones de accion (para cerrar el ticket)
                const button_id = int.customId;

                if(!isTicket(channel, guild)) {
                    return;
                }

                switch(button_id) {
                    case 'close':
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
                        int.reply({ embeds: embed_closed, components: [ btns_ticket_closed ] });

                        updateToClosed(guild, channel);

                        await wait(750);

                        int.guild.channels.fetch(channel).then( (channelEdit) => {
                            var userCreator = getUserCreator(guild, channel);
                            var currId = getCurTicketId(guild, channel);
                            var newName = config.tck.closed+'-'+currId;


                            var menu_id = getTicketCategory(guild, channel);
                            var category_info = Object.values(config.guilds[guild]).flat().find(r => r.id === menu_id);

                            if(category_info.allowed_staff.length > 0) {
                                var allowed_staff = [
                                    { id: int.member.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                                    { id: int.guild.members.cache.get(user), deny: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] },
                                    { id: category_info.allowed_staff, allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                                ];
                            } else {
                                var allowed_staff = [
                                    { id: int.member.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                                    { id: int.guild.members.cache.get(user), deny: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                                ];
                            }

                            channelEdit.edit({
                                name: newName,
                                permissionOverwrites: allowed_staff
                            });
                        });
                        break;
                    /* ================================================================================================================= */
                    case 'reopen':
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
                        int.reply({ embeds: embed_reopen, components: [ btns_ticket_reopen ] });

                        updateToOpen(guild, channel);

                        await wait(750);

                        int.guild.channels.fetch(channel).then( (channelEdit) => {
                            // int.guild.members.cache.get(userCreator)
                            var userCreator = getUserCreator(guild, channel);
                            var currId = getCurTicketId(guild, channel);
                            var newName = config.tck.open+'-'+currId;

                            var menu_id = getTicketCategory(guild, channel);
                            var category_info = Object.values(config.guilds[guild]).flat().find(r => r.id === menu_id);

                            if(category_info.allowed_staff.length > 0) {
                                var allowed_staff = [
                                    { id: int.member.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                                    { id: int.guild.members.cache.get(user), allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] },
                                    { id: category_info.allowed_staff, allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                                ];
                            } else {
                                var allowed_staff = [
                                    { id: int.member.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                                    { id: int.guild.members.cache.get(user), allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                                ];
                            }

                            channelEdit.edit({
                                name: newName,
                                permissionOverwrites: allowed_staff
                            });
                        });
                        break;
                    /* ================================================================================================================= */
                    case 'delete':
                        const sec = config.bot.secDelTicket;

                        const embed_delete = [{
                            color: 0xcc3366,
                            title: template.delete.title,
                            description: template.delete.description.replaceAll('{seconds}', sec),
                            footer: footer
                        }];
                        int.reply({ embeds: embed_delete });

                        await wait(sec * 1000);

                        const toDelete = int.guild.channels.cache.get(channel);

                        updateToDeleted(toDelete.guildId, toDelete.id);

                        toDelete.delete();
                    break;
                }
            break;
        }
    }
};
