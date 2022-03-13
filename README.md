## 🎫 RemTicketHelper
```
Sistema de tickets de soporte para discord
```

### 🧰 Recursos Utilizados
```
- NodeJS
- DiscordJS
- SQLite (BetterSQLite)
```

### 📋 Como Instalar
```js
npm install // Para descargar todas las dependencias
npm update  // Para mantener actualizdo las dependencias
```

### 📋 PM2
```
pm2 start index.js --name "Nombre del bot"
```

### 💻 Sistema MultiGuilds
El proyecto se ha creado inicialmente para utilizar en una sola guild a la vez pero, igualmente la misma está adaptada para poder operar en mas de una a la vez. El rendimiento en mas de 2 guilds no ha sido testeado.

El VPS que base para los bots cuenta con `1Gb RAM / 25Gb SSD NVMe / 1vCPU`, actualmente no presentan falta de recursos, el consumo de CPU y RAM por cada bot es super ínfimo. Actualmente en 1 VPS estamos hosteando un total de 9 bots (para Discord y Twitch).


### 📚 Comandos Disponibles
```
$rt about : Acerca del proyecto
$rt info  : Ver estado del bot

$rt sendembed : Enviar mensaje con el menú de tickets
$rt delete : Borrar un ticket de soporte
$rt close  : Cerrar un ticket
$rt reopen : Reabrir un ticket cerrado
```
