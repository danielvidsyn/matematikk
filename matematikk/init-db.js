const sqlite3 = require('sqlite3').verbose();

// Opprett en ny databasefil (eller koble til hvis den allerede eksisterer)
let db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Opprett themes-tabellen
db.run(`CREATE TABLE IF NOT EXISTS themes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
)`);

// Opprett questions-tabellen
db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY,
    theme_id INTEGER,
    content TEXT NOT NULL,
    FOREIGN KEY (theme_id) REFERENCES themes(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL
)`);

console.log('Tables created successfully.');

db.close();
