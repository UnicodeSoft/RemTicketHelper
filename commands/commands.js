// Data
const config = require('../data/config.json');
const emb = require('../data/embeds.json');

// Load Sentry Loggin resources
const Sentry = require("@sentry/node");
Sentry.init({ dsn: config.sentry.dsn, tracesSampleRate: 1.0 });

exports.run = (client, message, args) => {
    try {
        message.delete();

        const embed_content = [{
            color: 0xcc3366,
            title: '🎫 RemTicketHelper 🌸',
            description: 'Prefix base para los comandos: `'+config.bot.prefix+'`',
            fields: [
                { name: 'about', value: 'b' },
                { name: 'adduser', value: 'b' },
                { name: 'close', value: 'b' },
                { name: 'commands', value: 'b' },
                { name: 'delete', value: 'b' },
                { name: 'info', value: 'b' },
                { name: 'removeuser', value: 'b' },
                { name: 'reopen', value: 'b' },
                { name: 'sendembed', value: 'b' }
            ],
            footer: emb.footer
        }];

        message.channel.send({ embeds: embed_content });
    } catch(error) {
        Sentry.withScope(function(scope) {
            scope.setTag('enviroment', 'production');
            scope.setTag('bot_project', 'remtickethelper');
            scope.setTag('error_type', 'try_catch');
            scope.setTag('file', 'about.js');
            scope.setLevel('error');
            Sentry.captureException(error);
        });
        console.error(error);
    }
}
