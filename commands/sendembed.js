// Data
const config = require('../data/config.json');
const emb = require('../data/embeds.json');

// Load Sentry Loggin resources
const Sentry = require("@sentry/node");
Sentry.init({ dsn: config.sentry.dsn, tracesSampleRate: 1.0 });

// DiscordJs
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

exports.run = (client, message, args) => {
    try {
        message.delete();

        const guild_id = message.guildId;
        var categorias = [];

        for(let index = 0; index < config.guilds[guild_id].length; index++) {
            var data = config.guilds[guild_id][index];

            categorias.push({
                label: data.name,
                description: data.desc,
                value: data.id,
                emoji: data.emoji
            });
        }

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Selecciona una categoría')
                .addOptions(categorias),
        );

        const embed_content = [{
            color: emb.template.main_embed.color,
            title: emb.template.main_embed.title,
            description: emb.template.main_embed.description,
            footer: emb.footer
        }];

        message.channel.send({ embeds: embed_content, components: [row] });
        console.log(`[🎫] Envío de embed interactivo`);
    } catch(error) {
        Sentry.withScope(function(scope) {
            scope.setTag('enviroment', 'prod');
            scope.setTag('bot_project', 'remtickethelper');
            scope.setTag('error_type', 'try_catch');
            scope.setTag('file', 'sendembed.js');
            scope.setLevel('error');
            Sentry.captureException(error);
        });
        console.error(error);
    }
}