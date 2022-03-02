const config = require('../config.json');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

exports.run = (client, message, args) => {

    message.delete();

    var categorias = [];

    for(let index = 0; index < config.categories.length; index++) {
        var data = config.categories[index];

        categorias.push({
            label: data.name,
            description: data.desc,
            value: data.id,
            emoji: { name: data.emoji.name, id: data.emoji.id }
        });
    }

    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Selecciona una categoría')
            .addOptions(categorias),
    );

    const embed_content = [{
        color: 0xcc3366,
        title: '🎫 Sistema de Soporte',
        description: 'Para abrir un ticket de soporte, selecciona en la lista de abajo la categoría mas adecuada y nuestro staff te estará atendiendo en la brevedad posible.',
        footer: config.embed.footer
    }];


    message.channel.send({ embeds: embed_content, components: [row] });
}