// Load configuration files ================================================================================================
const config = require('./config.json');

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

// Handle :: Buttons Actions ===============================================================================================
const buttons = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for(const button of buttons) {
    const buttonName = button.split('.')[0];
    const event = require(`./buttons/${button}`);
    client.on(event.name, (...args) => event.execute(...args));
    console.log(`[Init] Recurso cargado: ${buttonName}`);
}

// Handle :: Events ========================================================================================================
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of events) {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args));
    console.log(`[Init] Evento cargado:  ${eventName}`);
}

// Custom Commands (with prefix) ===========================================================================================
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