## 🎫 RemTicketHelper
```
Sistema de tickets de soporte para discord
```

### 🧰 Dependencias Utilizadas
```
• NodeJS
• DiscordJS
• SQLite (BetterSQLite)
• fs (para la lectura de ficheros necesarios)
• os & cpu-stat (para monitoreo de recursos)
```

### 📋 Como Instalar
```js
npm install // instalar las dependencias
npm update  // actualizar las dependencias
```

### 🔍 Info adicional
```
Recuerda modificar en el archivo "ecosystem.config.js" el nombre
Este es el que aparecerá en el monitor de pm2 
```

### 📋 PM2
```
pm2 start
```

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

---

### 💻 Sistema MultiGuilds
El proyecto contempla la gestión de _tickets_ en múltiples servidores, hasta el momento se ha utilizado una instancia del proyecto para hasta 3 guilds y no ha demostrado variación en el consumo de recursos.

El VPS utilizado para esta prueba consta de `1Gb RAM + 25Gb SSD NVMe + 1vCPU`, y no presentó en ningún momento falta de recursos.

---
### 📋 En proceso de prueba e implementación
- [ ] Remake a la gestión de interacciones
- [ ] Sistema de transcripción de tickets
- [ ] Convertir todos los comandos a slash
- [ ] Sistema de backup de la base de datos
---

### 📄 Licencia y Derechos
Todos los derechos reservados para el trabajo realizado. <br>
Se respetan así también los derechos y las licencias a todas las dependencias utilizadas en la realización de este proyecto.

---

<p align="center">
    Proyecto protegido por la DMCA <br>
    <a href="https://www.dmca.com/r/d0y5rx5"> <img src="https://kuroneko.im/web_assets/dmca.png"/> </a>
</p>
