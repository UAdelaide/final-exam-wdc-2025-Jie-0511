const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    // host: 'localhost',
    // host:"/var/run/mysqld/mysqld.sock",
    user: 'root',
    password: '',
    database: 'DogWalkService'
});

module.exports = pool;
