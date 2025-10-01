const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "../database/reviews.db"));
db.serialize(() => db.run("PRAGMA foreign_keys=ON"));

module.exports = db;