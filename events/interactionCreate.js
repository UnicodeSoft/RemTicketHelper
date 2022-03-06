const config = require('../data/config.json');

// SQLite
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data/ticket_db.sqlite');

// DiscordJs
const { MessageActionRow, MessageButton } = require('discord.js');

// Timezone
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');

// This thing...
const wait = require('node:timers/promises').setTimeout;

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

        interaction.deferUpdate();

        switch(interaction.componentType) {
            case 'SELECT_MENU':
                const menu_id = interaction.values[0];

                const category_info = Object.values(config.guilds[guild]).flat().find(r => r.id === menu_id);
                const total_abierto = interaction.countOpenTicketsOnCat.get(user, guild, menu_id).count;

                if(total_abierto >= category_info.limit) {
                    return interaction.reply({ content: "🎫 Has alcanzado el límite de tickets abiertos en esta categoría...", ephemeral: true });
                }

                await wait(1000); // no funciona...

                await interaction.guild.channels.create('ticket_name', {
                    type: 'text',
                    parent: category_info.id,
                    permissionOverwrites: [
                        { id: interaction.member.guild.roles.everyone.id, deny: [ 'VIEW_CHANNEL' ] },
                        { id: interaction.guild.members.cache.get(user), allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] },
                        { id: category_info.allowed_staff, allow: [ 'VIEW_CHANNEL', 'SEND_MESSAGES' ] }
                    ]
                }).then(async (channel) => {
                    channel.send(`Hi <@${user}>`);
                    // add para guardar en la base de datos
                    // add para que la respuesta sea con embed y botoncitos
                });

            break;
            /* ============================================================================================================================== */
            case 'BUTTON': // Botones de accion (para cerrar el ticket)
                const button_id = interaction.customId;
            break;
        }
    }
};
