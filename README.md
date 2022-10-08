<h2 align="center"> 🎫 RemTicketHelper </h2>

<pre align="center">
Sistema de tickets de soporte para discord
</pre>

<p align="center">
⚠ ⚠ <b>// Proyecto EOL //</b> ⚠ ⚠ <br>
Este proyecto queda como una versión <code>Legacy</code>, por lo que no contará con actualizaciones y ya no será mantenido. <br>
Actualmente se encuentra en desarrollo una versión mejorada del proyecto, con el cual se busca encarar varios aspectos nuevos en cuanto a seguridad, optimizaciones e implementaciones se refiere.
</p>

<br><br>


### 🧰 Dependencias Utilizadas
```
• NodeJS
• DiscordJS
• SQLite (BetterSQLite)
• fs (para la lectura de ficheros necesarios)
• os & cpu-stat (para monitoreo de recursos)
```

<br>

### 📋 Como Instalar
```js
npm install // instalar las dependencias
npm update  // actualizar las dependencias
```

<br>

### 🔍 Info adicional
```
Recuerda modificar en el archivo "ecosystem.config.js" el nombre
Este es el que aparecerá en el monitor de pm2 
```

<br>

### 📋 PM2
```
pm2 start
```

<br>

### 📚 Comandos Disponibles
| Comando | Detalles |
|:-------:|:--------:|
| `$rt about`| Para ver información acerca de este proyecto |
| `$rt info`| Ver información del servidor (recursos), uptime del bot y versión de d.js |
| `$rt sendembed`| Para enviar en un canal específico, el embed con la lista de categorías |
| `$rt close`| Cerrar el ticket de soporte en el que te encuentras |
| `$rt delete`| Borrar el ticket de soporte en el que te encuentras |
| `$rt reopen`| Reabrir el ticket de soporte en el que te encuentras |
| `$rt adduser user_id`| Agregar un usuario al ticket de soporte en el que te encuentras |
| `$rt removeuser user_id`| Eliminar un usuario del ticket de soporte en el que te encuentras |

<br>

### 💻 Sistema MultiGuilds
El proyecto contempla la gestión de _tickets_ en múltiples servidores, hasta el momento se ha utilizado una instancia del proyecto para hasta 3 guilds y no ha demostrado variación en el consumo de recursos. El VPS utilizado para esta prueba consta de `1Gb RAM + 25Gb SSD NVMe + 1vCPU`, y no presentó en ningún momento falta de recursos.

<br>

### 📖 Documentación
Podrás encontrar una documentación mas completa [aquí](https://imkuroneko.gitbook.io/remtickethelper/)

<br>

### 📋 En proceso de prueba e implementación
- [ ] Remake a la gestión de interacciones
- [ ] Sistema de transcripción de tickets
- [ ] Convertir todos los comandos a slash
- [ ] Sistema de backup de la base de datos

<br>

### 📄 Licencia y Derechos
Todos los derechos reservados para el trabajo realizado. <br>
Se respetan así también los derechos y las licencias a todas las dependencias utilizadas en la realización de este proyecto.

---

<p align="center">
    Proyecto protegido por la DMCA <br>
    <a href="https://www.dmca.com/r/0mlxgll"> <img src="https://kuroneko.im/web_assets/dmca.png"/> </a>
</p>
