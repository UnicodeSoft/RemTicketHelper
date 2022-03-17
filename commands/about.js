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
            description:
                'Sistema básico de tickets para discord basado en NodeJS y SQLite.'+
                '\n\n👰🏻 Desarrollado y mantenido por: [@KuroNeko](https://github.com/imkuroneko)'+
                '\nPara el proyecto [🦄 Unicodesoft](https://github.com/UnicodeSoft).',
            footer: emb.footer
        }];

        message.channel.send({ embeds: embed_content });
    } catch(error) {
        Sentry.withScope(function(scope) {
            scope.setTag('enviroment', 'prod');
            scope.setTag('bot_project', 'remtickethelper');
            scope.setTag('error_type', 'try_catch');
            scope.setTag('file', 'about.js');
            scope.setLevel('error');
            Sentry.captureException(error);
        });
        console.error(error);
    }
}
