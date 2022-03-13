const config = require('../data/config.json');
const emb = require('../data/embeds.json');

exports.run = (client, message, args) => {
    try {
        const prefix = config.bot.prefix;
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
        console.log(error);
    }
}
