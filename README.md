# RemTicketHelper
🎫 Sistema de tickets de soporte para discord


#### Estructura del archivo `config.json`
```json
{

    "bot" : {
        "clientId": "id_del_bot",
        "token"   : "token_del_bot",
        "prefix"  : "$rt",
        "ownerId" : "id_del_owner_del_server (será control para ciertas funcionalidades)"
    },

    "guilds" : {
        "id_del_server" : [
            {
                "emoji" : { "id" : "id_del_emoji_custom", "name" : "nombre_del_emoji_custom"},
                "name" : "nombre de la categoría (ej: Soporte Técnico)",
                "desc" : "una breve descripción de hasta 50 caractéres (de pasarse el límite, no se leerá mas desde el cliente de PC o navegador)",
                "allowed_staff" : "el id del rol que podrá ver esta categoría",
                "id" : "id único de la categoría donde se crearán los tickets (cada categoría para ticket que crees, deberá tener su propia categoría en el discord)"
            },
            " ^ copiar el esquema de arriba según cada categoría que vayas a necesitar"
        ],
        " ^ copiar el esquema de arriba si utilizarás en mas de un discord (leer disclaimer en la sección de abajo del readme.md)"
    },

    "embed_content" : {
        "footer" : {
            "url" : "https://unicodesoft.net",
            "icon_url": "https://i.imgur.com/4IDrwRx.png",
            "text" : "🦄 by Unicodesoft | Todos los derechos reservados"
        },
        "main_open_ticket" : {
            "title" : "🎫 Sistema de Soporte",
            "description" : "Para abrir un ticket de soporte, selecciona en la lista de abajo la categoría mas adecuada y nuestro staff te estará atendiendo en la brevedad posible."
        },
        "ticket_opened" : {
            "title" : "Bienvenido {user_mention} a nuestro sistema de tickets para {catname_mention}!",
            "description" : "Por favor explayese lo mas posible por este medio y, uno de nuestros staff te estará ayudando en la brevedad.\n Si abriste este ticket por error, utiliza el siguiente comando: `{prefix_mention} delete`"
        },
        "ticket_closed" : {
            "title" : "📘 Ticket Cerrado",
            "description" : "El ticket ha sido marcado como cerrado; para eliminarlo utilice el comando `{prefix_mention} delete` o, `{prefix_mention} reopen` para abrir nuevamente el ticket."
        },
        "ticket_reopened" : {
            "title" : "📖 Ticket Reabierto",
            "description" : "El ticket ha sido abierto nuevamente por un staff."
        },
        "ticket_will_deleted" : {
            "seconds" : "10",
            "title" : "🗑 Ticket Eliminado",
            "description" : "Este ticket será eliminado en unos segundos."
        }
    }
}
```


#### Disclaimer MultiGuilds
Este proyecto ha sido creado inicialmente para operar en un solo servidor (guild); la base de datos está creada para verificar también el ID del guild para poder soportar mas de uno, pero dado el tipo de proyecto, no podemos indicar si el rendimiento del mismo influirá al estar en múltiples servidores (para nuestro uso propio, está abarcado en 2 guilds)

En cuanto a recuersos, el VPS que utilizamos tiene los siguientes recursos: `1Gb RAM / 25Gb SSD / 1vCPU` (Plan 5USD de DigitalOcean) y los recursos son compartidos con otros 5 bots utilitarios de distintas funcionalidades e implementaciones.


### Info Linux
En teoría es necesario instalar esto (a verificar): `sudo apt-get install build-essential`

### Info Windows
En teoría es necesario instalar esto (a verificar): `npm i --vs2015 -g windows-build-tools`