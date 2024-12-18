const db = require('../models/database');  // Import the database connection

// Function to execute a SELECT * FROM query and return a promise with all records
function getAllQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);  // Reject the promise with an error if something goes wrong
            } else {
                resolve(rows);  // Resolve the promise with the rows if successful
            }
        });
    });
}

module.exports = getAllQuery;
