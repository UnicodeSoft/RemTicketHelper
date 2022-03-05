const config = require('../config.json');

module.exports = {
    name: 'ready',
    async execute(client) {

        console.log(`[🦄] Bot iniciado exitosamente como ${client.user.tag}!`);

        client.user.setActivity(`${config.guilds.length} servidores tickets! 🎫`, {type: 'WATCHING'});
    }
}