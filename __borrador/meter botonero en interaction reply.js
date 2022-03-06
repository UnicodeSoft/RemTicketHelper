const row = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('primary')
        .setLabel('Primary')
        .setStyle('PRIMARY'),
);

interaction.reply({ content: 'Pong!', components: [row] });
