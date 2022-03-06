const config = require('../data/config.json');

const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');

module.exports = {
    name: 'ready',
    async execute(client) {

        dayjs.extend(timezone);
        dayjs.tz.setDefault(config.bot.timezone);
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

        // Log bot iniciado
        console.log(`[🦄] Bot iniciado exitosamente como ${client.user.tag} a las ${timestamp}!`);

        // Definir actividad al bot
        client.user.setActivity(`${config.guilds.length} servidores tickets! 🎫`, {type: 'WATCHING'});
    }
}
