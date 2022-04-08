// SQLite
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data/db.sqlite');

const row = sql.prepare("SELECT user FROM tickets_external_participants WHERE channel = ? AND guild = ? ; ");
console.log(row.all('960894946699796552', '793908257672265799'));