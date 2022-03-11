// Load configuration files ================================================================================================
const config = require('./data/config.json');

// Load required resources =================================================================================================
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

// Define client Intents ===================================================================================================
const client = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'CHANNEL' ],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

// Handle del discord.js para la gestión de tickets según eventos ==========================================================
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of events) {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args));
    console.log(`[Init] Evento cargado:  ${eventName}`);
}

// Comandos para gestión de tickets creados (y comandos utilitarios) =======================================================
client.commandsPrefix = new Collection();
const prefixCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));
for(const prefixFile of prefixCommandFiles) {
    var commandName = prefixFile.split(".")[0];
    var command = require(`./commands/${prefixFile}`);
    client.commandsPrefix.set(commandName, command);
    console.log(`[Init] Recurso de comando cargado: ${commandName}`);
}

// Define token a init bot =================================================================================================
client.login(config.bot.token);

// Handle Error ============================================================================================================
process.on('unhandledRejection', error => {
    console.error('[❌] Error: ', error);
});