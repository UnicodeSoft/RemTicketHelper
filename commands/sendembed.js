const config = require('../data/config.json');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

exports.run = (client, message, args) => {

    message.delete();

    const guild_id = message.guildId;
    var categorias = [];

    for(let index = 0; index < config.guilds[guild_id].length; index++) {
        var data = config.guilds[guild_id][index];

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
        title: config.embed_content.main_open_ticket.title,
        description: config.embed_content.main_open_ticket.description,
        footer: config.embed_content.footer
    }];


    message.channel.send({ embeds: embed_content, components: [row] });
}