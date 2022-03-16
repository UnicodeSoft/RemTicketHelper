// Config
const config = require('../data/config.json');

// SQLite
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data/db.sqlite');

// Timezone
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');

module.exports = {
    isTicket: function(channel_id, guild) {
        const query = sql.prepare(" SELECT count(*) as count FROM tickets WHERE channel = ? AND guild = ? ");
        if(query.get(channel_id, guild).count > 0) {
            return true;
        } else {
            return false;
        }
    },

    userTicketsOnCat: function(user, guild, category) {
        const query = sql.prepare(" SELECT count(*) as count FROM tickets WHERE user = ? AND guild = ? AND category = ? AND status = 'A' ");
        return query.get(user, guild, category).count;
    },

    getNewTicketId: function(guild, category) {
        const query = sql.prepare(" SELECT count(*) as count FROM tickets WHERE guild = ? AND category = ? ");
        const num = parseInt(query.get(guild, category).count + 1);
        return num.toString().padStart(5, '0');
    },

    getCurTicketId: function(guild, channel) {
        const query = sql.prepare(" SELECT ticket FROM tickets WHERE guild = ? AND channel = ? ");
        return query.get(guild, channel).ticket.toString().padStart(4, '0');
    },

    getUserCreator: function(guild, channel) {
        const query = sql.prepare(" SELECT user FROM tickets WHERE guild = ? AND channel = ? ");
        return query.get(guild, channel).user.toString();
    },

    getTicketCategory: function(guild, channel) {
        const query = sql.prepare(" SELECT category FROM tickets WHERE guild = ? AND channel = ? ");
        return query.get(guild, channel).category.toString();
    },

    updateToOpen: function(guild, channel) {
        const query = sql.prepare(" UPDATE tickets SET status = 'A' WHERE guild = @gld AND channel = @chn; ");
        query.run({
            gld: guild,
            chn: channel
        });
    },

    updateToClosed: function(guild, channel) {
        const query = sql.prepare(" UPDATE tickets SET status = 'C' WHERE guild = @gld AND channel = @chn; ");
        query.run({
            gld: guild,
            chn: channel
        });
    },

    updateToDeleted: function(guild, channel) {
        dayjs.extend(timezone);
        dayjs.tz.setDefault(config.bot.timezone);
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

        const query = sql.prepare(" UPDATE tickets SET status = 'D', timestamp_deletion = @tms WHERE guild = @gld AND channel = @chn; ");
        query.run({
            gld: guild,
            chn: channel,
            tms: timestamp
        });
    },

    saveNewTicket: function(guild, category, channel, user) {
        dayjs.extend(timezone);
        dayjs.tz.setDefault(config.bot.timezone);
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

        const query = sql.prepare(" INSERT INTO tickets (guild, category, channel, user, timestamp_creation) VALUES (@gld, @cat, @chn, @usr, @tms); ");
        query.run({
            gld: guild,
            cat: category,
            chn: channel,
            usr: user,
            tms: timestamp
        });
    }

};
