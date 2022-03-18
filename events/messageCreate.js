// Data
const config = require('../data/config.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            // 🚨 Ignore bots
            if(message.author.bot) { return; }

            // 🚨 Ignore when not prefix
            if(message.content.indexOf(config.bot.prefix) !== 0) {
                return;
            }

            // 🥞 Split content
            const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            // 🔍 Search command
            const cmd = message.client.commandsPrefix.get(command);

            if(!cmd) { return; }

            cmd.run(message.client, message, args);
        } catch (error) {
            Sentry.withScope(function(scope) {
                scope.setTag('enviroment', 'production');
                scope.setTag('bot_project', 'remtickethelper');
                scope.setTag('error_type', 'errorHandler');
                scope.setTag('file', 'messageCreate.js');
                scope.setLevel('error');
                Sentry.captureException(error);
            });
            console.error(error);
        }
    }
}