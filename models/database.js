const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        db.run(`CREATE TABLE IF NOT EXISTS student (
            student_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) {
                console.error("Student table creation error: ", err.message);
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS professor (
            professor_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) {
                console.error("Professor table creation error: ", err.message);
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS slot (
            slot_id INTEGER PRIMARY KEY AUTOINCREMENT,
            professor_id INTEGER,
            start_time DATETIME,
            isBooked BOOLEAN DEFAULT 0,  
            student_id  INTEGER DEFAULT 0,
            FOREIGN KEY (professor_id) REFERENCES professor(professor_id)
        )`, (err) => {
            if (err) {
                console.error("Slot table creation error: ", err.message);
            }
        });
    }
});

module.exports = db;