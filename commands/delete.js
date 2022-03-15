// Data
const config = require('../data/config.json');
const { template, footer } = require('../data/embeds.json');
const { isTicket, updateToDeleted } = require('../functions.js');

// DiscordJs
const { MessageActionRow, MessageButton } = require('discord.js');

// This thing...
const wait = require('node:timers/promises').setTimeout;

exports.run = async (client, message, args) => {
    try {
        const guildId = message.guildId;
        const channelId = message.channelId;

        if(!isTicket(channelId, guildId)) {
            return;
        }

        const sec = config.bot.secDelTicket;

        const embed_delete = [{
            color: template.delete.color,
            title: template.delete.title,
            description: template.delete.description.replaceAll('{seconds}', sec),
            footer: footer
        }];
        message.reply({ embeds: embed_delete });

        await wait(sec * 1000);

        const toDelete = message.guild.channels.cache.get(channelId);

        updateToDeleted(toDelete.guildId, toDelete.id);

        toDelete.delete();
    } catch(error) {
        console.log(error);
    }
}