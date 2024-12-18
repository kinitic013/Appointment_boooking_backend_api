const db = require("../models/database")

function runQuery(sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID });
        });
    });
}
module.exports = runQuery;