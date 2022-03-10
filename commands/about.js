const config = require('../data/config.json');
const emb = require('../data/embeds.json');

exports.run = (client, message, args) => {
    const prefix = config.bot.prefix;
    message.delete();

    const embed_content = [{
        color: 0xcc3366,
        title: '🎫 RemTicketHelper 🌸',
        description: 'Este proyecto nació en una fase de aburrimiento, donde me propuse poder crear de forma fácil y lo mas óptimo posible (con mis conocimientos básicos de JavaScript, el crear un bot que cubra un sistema de tickets.\n\n👰🏻 Desarrollado y mantenido por: [@KuroNeko](https://github.com/imkuroneko) bajo el proyecto [🦄 Unicodesoft](https://github.com/UnicodeSoft).\n🤖 Repositorio: [clic aquí](https://github.com/UnicodeSoft/RemTicketHelper)',
        footer: emb.footer
    }];

    message.channel.send({ embeds: embed_content });
}
