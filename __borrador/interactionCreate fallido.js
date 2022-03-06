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


        console.log(interaction.values);
        console.log(interaction.values[0]); return;


        // 📘 Datos Necesarios
        const guild = interaction.guildId;
        const c_id = interaction.customId;
        const user = interaction.user.id;

        console.log(guild);
        console.log(c_id);
        console.log(user);

        switch(interaction.componentType) {
            case 'SELECT_MENU':
                const menu_id = interaction.values[0];

                var category_info;

                const cats_from_guild = config.guilds[guild];
                for(let index = 0; index < cats_from_guild.length; index++) {
                    if(cats_from_guild[index].id == c_id) {
                        category_info = cats_from_guild[index];
                    }
                }

                const total_abierto = interaction.countOpenTicketsOnCat.get(user, guild, c_id).count;

                // const category_info_uwu = Object.values(config.guilds[guild]).flat().find(r => r.id === c_id);
                // console.log(category_info_uwu);

                if(total_abierto >= category_info.limit) {
                    await interaction.reply({ content: "🎫 Has alcanzado el límite de tickets abiertos en esta categoría...", ephemeral: true });
                } else {
                    await interaction.reply({ content: "🎫 Abriendo ticket, por favor espera...", ephemeral: true });
                }
            break;
            /* ============================================================================================================================== */
            case 'BUTTON': // Botones de accion (para cerrar el ticket)
            break;
        }
    }
};
