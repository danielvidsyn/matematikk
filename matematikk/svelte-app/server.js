const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;

const db = new sqlite3.Database('./mydb.sqlite');
const SECRET_KEY = 'your_secret_key';  // Dette bør lagres sikkert, f.eks. i en .env-fil

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'svelte-app', 'public')));

function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

// API-endepunkter for temaer
app.get('/api/themes', (req, res) => {
    db.all("SELECT * FROM themes", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/api/themes', (req, res) => {
    const { name } = req.body;
    const stmt = db.prepare("INSERT INTO themes (name) VALUES (?)");
    stmt.run(name, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// API-endepunkter for spørsmål
app.get('/api/questions', (req, res) => {
    db.all("SELECT * FROM questions", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/api/questions', (req, res) => {
    const { content, theme_id } = req.body;
    const stmt = db.prepare("INSERT INTO questions (content, theme_id) VALUES (?, ?)");
    stmt.run(content, theme_id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

app.delete('/api/questions/:id', (req, res) => {
    const stmt = db.prepare("DELETE FROM questions WHERE id = ?");
    stmt.run(req.params.id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Deleted successfully" });
    });
});

// Registrering
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')");
    stmt.run(username, hashedPassword, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Innlogging
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
        res.json({ token });
    });
});

// Fallback-rute for SPA-routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'svelte-app', 'public', 'index.html'));
});

// Start serveren
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
