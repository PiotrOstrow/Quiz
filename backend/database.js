const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE_NAME = "database.db";

const db = new sqlite3.Database(DB_FILE_NAME, err => {
    if(err) {
        console.log(err);
        throw err;
    }

    console.log('Connected to database');
    console.log('Creating tables...');

    const databaseStructureSQL = fs.readFileSync('./sql/data_structure.sql').toString();
    const databaseStructureQueries = databaseStructureSQL.split(';');

    for(let i = 0; i < databaseStructureQueries.length; i++) {
        if(databaseStructureQueries[i].trim() !== "") {
            db.run(databaseStructureQueries[i], error => {
                if (error) {
                    console.log(error.message);
                } else {
                    console.log('Created table ' + databaseStructureQueries[i].match(/(?<=CREATE TABLE ).*\b/));
                }
            });
        }
    }
});

module.exports.db = db;
