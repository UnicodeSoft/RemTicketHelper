const config = require('../data/config.json');

exports.run = (client, message, args) => {
    const prefix = config.bot.prefix;
    message.delete();

    const embed_content = [{
        color: 0xcc3366,
        title: '📋 Comandos del Bot',
        description: 'Aquí tienes la lista de todos los comandos con los que cuenta el bot!',
        fields : [
            { inline: false, name: `${prefix} about`, value: 'Acerca del proyecto.' },
            { inline: false, name: `${prefix} help`, value: 'Obtener esta lista de comandos disponibles.' },
            { inline: false, name: `${prefix} sendembed`, value: 'Enviar el mensaje con el menú de categorías de tickets.' },
            { inline: false, name: `${prefix} delete`, value: 'Borrar un ticket.' },
            { inline: false, name: `${prefix} info`, value: 'Ver el estado de bot (uptime & recursos).' },
            { inline: false, name: `${prefix} close`, value: 'Cerrar un ticket. (Inhabilita la lectura al usuario que abrió el ticket).' },
            { inline: false, name: `${prefix} reopen`, value: 'Reabrir un ticket. (Rehabilita la lectura al usuario que abrió el ticket).' },
            { inline: false, name: `${prefix} ban <@user>`, value: 'Banear a un usuario para que no utilice el sistema de tickets. (Baneo persistente, en caso de salir y volver al servidor, esta prohibición persistirá).' },
            { inline: false, name: `${prefix} unban <@user>`, value: 'Desbanear a un usuario para que pueda utilizar nuevamente el sistema de tickets.' },
        ],
        footer: config.embed.footer
    }];

    message.channel.send({ embeds: embed_content });
}