const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    // host: 'localhost',
    host: ""
    host:""
    user: 'root',
    password: '',
    database: 'DogWalkService'
});

module.exports = pool;
