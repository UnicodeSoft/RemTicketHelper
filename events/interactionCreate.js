const config = require('../data/config.json');

// Custom functions 💜
const { userTicketsOnCat, getNewTicketId, saveNewTicket } = require('../functions.js');

// DiscordJs
const { MessageActionRow, MessageButton } = require('discord.js');

// This thing...
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'interactionCreate',
    async execute(int) {

        // 📘 Datos Necesarios
        const guild = int.guildId;
        const user = int.user.id;

        switch(int.componentType) {
            case 'SELECT_MENU':
                const menu_id = int.values[0];

                const category_info = Object.values(config.guilds[guild]).flat().find(r => r.id === menu_id);
                const total_open = userTicketsOnCat(user, guild, menu_id);

                const embed_content = [{
                    color: 0xcc3366,
                    title: config.embed_content.main_open_ticket.title,
                    description: config.embed_content.main_open_ticket.description,
                    footer: config.embed_content.footer
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

                int.guild.channels.create(`tck-${newTicketId}`, {
                    type: 'text',
                    parent: category_info.id,
                    permissionOverwrites: allowed_staff
                }).then(async (channel) => {
                    saveNewTicket(guild, category_info.id, channel.id, user);

                    await int.followUp({
                        content: `🎫 Tu ticket se ha creado: <#${channel.id}>`,
                        ephemeral: true
                    });

                    const embed_welcome = [{
                        color: 0xcc3366,
                        title: config.embed_content.ticket_opened.title.replace('{catname_mention}', category_info.name),
                        description: config.embed_content.ticket_opened.description.replace('{prefix_mention}', config.bot.prefix),
                        footer: config.embed_content.footer
                    }];

                    const btns_ticket =  new MessageActionRow()
                        .addComponents(
                            new MessageButton().setCustomId(`close;${channel.id}`).setLabel('Cerrar Ticket').setStyle('DANGER')
                        );

                    channel.send({ content: `Hola <@${user}>!`, embeds: embed_welcome, components: [ btns_ticket ] });
                });
            break;
            /* ============================================================================================================================== */
            case 'BUTTON': // Botones de accion (para cerrar el ticket)
                const button_id = int.customId;
                const data = button_id.explode(';');
                const action = data[0];
                const channel_id = data[1];

                switch(action) {
                    case 'closed':
                        const embed_closed = [{
                            color: 0xcc3366,
                            title: config.embed_content.ticket_closed.title,
                            description: config.embed_content.ticket_closed.description.replace('{prefix_mention}', config.bot.prefix),
                            footer: config.embed_content.footer
                        }];
    
                        const btns_ticket_closed =  new MessageActionRow()
                            .addComponents(
                                new MessageButton().setCustomId(`close;${channel.id}`).setLabel('Cerrar Ticket').setStyle('DANGER')
                            );
                        int.send({ content: `Hola <@${user}>!`, embeds: embed_closed, components: [ btns_ticket_closed ] });
                    break;
                    /* ================================================================================================================= */
                    case 'reopen':
                        const embed_reopen = [{
                            color: 0xcc3366,
                            title: config.embed_content.ticket_opened.title.replace('{catname_mention}', category_info.name),
                            description: config.embed_content.ticket_opened.description.replace('{prefix_mention}', config.bot.prefix),
                            footer: config.embed_content.footer
                        }];
    
                        const btns_ticket_reopen =  new MessageActionRow()
                            .addComponents(
                                new MessageButton().setCustomId(`close;${channel.id}`).setLabel('Cerrar Ticket').setStyle('DANGER')
                            );
                        int.send({ content: `Hola <@${user}>!`, embeds: embed_reopen, components: [ btns_ticket_reopen ] });
                    break;
                    /* ================================================================================================================= */
                    case 'delete':
                        const embed_delete = [{
                            color: 0xcc3366,
                            title: config.embed_content.ticket_opened.title.replace('{catname_mention}', category_info.name),
                            description: config.embed_content.ticket_opened.description.replace('{prefix_mention}', config.bot.prefix),
                            footer: config.embed_content.footer
                        }];
    
                        const btns_ticket_delete =  new MessageActionRow()
                            .addComponents(
                                new MessageButton().setCustomId(`close;${channel.id}`).setLabel('Cerrar Ticket').setStyle('DANGER'),
                                new MessageButton().setCustomId(`close;${channel.id}`).setLabel('Cerrar Ticket').setStyle('DANGER'),
                            );
                        int.send({ content: `Hola <@${user}>!`, embeds: embed_delete, components: [ btns_ticket_delete ] });
                    break;
                }
            break;
        }
    }
};
