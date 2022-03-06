const config = require('../data/config.json');

// SQLite
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data/ticket_db.sqlite');

// DiscordJs
const { MessageActionRow, MessageButton } = require('discord.js');

// Timezone
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');


module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // ⏰ Timezone
        dayjs.extend(timezone);
        dayjs.tz.setDefault(config.bot.timezone);
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

        // 🥫 Shorthands para SQLite
        interaction.getOpenTicketsOnCat = sql.prepare(" SELECT * FROM tickets WHERE user = ? AND guild = ? AND category = ? AND status = 'A' ");
        interaction.countOpenTicketsOnCat = sql.prepare(" SELECT count(*) as count FROM tickets WHERE user = ? AND guild = ? AND category = ? AND status = 'A' ");
        interaction.saveNewTicket = sql.prepare(" INSERT INTO tickets (ticket, guild, category, channel, user, timestamp_creation) VALUES (@ticket, @guild, @category, @channel, @user, @timestamp); ");      

        // 📘 Datos Necesarios
        const guild = interaction.guildId;
        const user = interaction.user.id;

        switch(interaction.componentType) {
            case 'SELECT_MENU':

                console.log(interaction.values[0]);

                const menu_id = interaction.values[0];

                const category_info = Object.values(config.guilds[guild]).flat().find(r => r.id === menu_id);
                const total_abierto = interaction.countOpenTicketsOnCat.get(user, guild, menu_id).count;

                if(total_abierto >= category_info.limit) {
                    return interaction.reply({ content: "🎫 Has alcanzado el límite de tickets abiertos en esta categoría...", ephemeral: true });
                }

                interaction.reply({ content: "🎫 Abriendo ticket, por favor espera...", ephemeral: true });


                // averiguar bien como es el sistema de add/remove permisos a canales para crear

                var permissions_list = [];
                
                permissions_list.push({
                    id: channel.guild.roles.everyone,
                    allow: [ 'VIEW_CHANNEL' ],
                });

                for(let index = 0; index < category_info.allowed_staff.length; index++) {
                    var data = category_info.allowed_staff[index];

                    console.log(`Rol: ${data}`);

                    permissions_list.push({
                        id: data,
                        allow: [ 'VIEW_CHANNEL' ],
                    });
                }

                interaction.guild.channels.create('ticket_name', {
                    type: 'text',
                    parent: category_info.id,
                    permissionOverwrites: [ permissions_list ]
                });
            break;
            /* ============================================================================================================================== */
            case 'BUTTON': // Botones de accion (para cerrar el ticket)
                const button_id = interaction.customId;
            break;
        }
    }
};
