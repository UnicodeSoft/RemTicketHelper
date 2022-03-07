// Config
const config = require('./data/config.json');

// SQLite
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data/ticket_db.sqlite');

// Timezone
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');

module.exports = {
    userTicketsOnCat: function(user, guild, menu_id) {
        const query = sql.prepare(" SELECT count(*) as count FROM tickets WHERE user = ? AND guild = ? AND category = ? AND status = 'A' ");
        return query.get(user, guild, menu_id).count;
    },

    getNewTicketId: function(guild, menu_id) {
        const query = sql.prepare(" SELECT count(*) as count FROM tickets WHERE guild = ? AND category = ? ");
        const num = parseInt(query.get(guild, menu_id).count + 1);

        return num.toString().padStart(5, '0');
    },

    saveNewTicket: function(ticket, guild, category, channel, user) {
        dayjs.extend(timezone);
        dayjs.tz.setDefault(config.bot.timezone);
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

        const query = sql.prepare(" INSERT INTO tickets (ticket, guild, category, channel, user, timestamp_creation) VALUES (@tck, @gld, @cat, @chn, @usr, @tms); ");
        query.run({
            tck: ticket,
            gld: guild,
            cat: category,
            chn: channel,
            usr: user,
            tms: timestamp
        });
    }

};