const { MessageActionRow, MessageSelectMenu } = require('discord.js');

exports.run = (client, message, args) => {

    console.log(client.channels.cache.get(message.channelId));
    return

    const sender = client.guild.channels.cache.get(message.channelId);

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions([
                    { label: 'Select me', description: 'This is a description', value: 'first_option' },
                    { label: 'You can select me too', description: 'This is also a description', value: 'second_option' }
                ]),
        );

    sender.send({ content: 'Pong!', components: [row] });
}