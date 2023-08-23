const mysql = require('mysql');

const myDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'userprofile',
});

myDB.connect((err) => {
    if (err) console.log(err);
    else console.log("Connected to the database");
});

module.exports = myDB;