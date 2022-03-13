module.exports = {
    name: 'ready',
    async execute(client) {

        // Log bot iniciado
        console.log(`[🦄] Bot iniciado exitosamente como ${client.user.tag}!`);

        // Definir actividad al bot
        client.user.setActivity("los tickets de soporte creados! 🎫", {type: 'WATCHING'});
    }
}
