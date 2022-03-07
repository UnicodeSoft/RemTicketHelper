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
                    saveNewTicket(newTicketId, guild, category_info.id, channel.id, user);

                    await int.followUp({
                        content: `🎫 Tu ticket se ha creado: <#${channel.id}>`,
                        ephemeral: true
                    });

                    /*
                    channel.send({
                        content: `Hola <@${user}>! Bienvenido al sistema de tickets`
                        embed: ''
                    });
                    */
                });
            break;
            /* ============================================================================================================================== */
            case 'BUTTON': // Botones de accion (para cerrar el ticket)
                const button_id = int.customId;
            break;
        }
    }
};
