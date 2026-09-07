const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'favorites.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initialize();
      }
    });
  }

  initialize() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        artist TEXT,
        url TEXT UNIQUE NOT NULL,
        duration INTEGER,
        thumbnail TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  addFavorite(userId, track) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR IGNORE INTO favorites (userId, title, artist, url, duration, thumbnail)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, track.title, track.artist, track.url, track.duration, track.thumbnail],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  removeFavorite(userId, url) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM favorites WHERE userId = ? AND url = ?`,
        [userId, url],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  isFavorite(userId, url) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT id FROM favorites WHERE userId = ? AND url = ?`,
        [userId, url],
        (err, row) => {
          if (err) reject(err);
          else resolve(!!row);
        }
      );
    });
  }

  getFavorites(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM favorites WHERE userId = ? ORDER BY createdAt DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = new Database();
