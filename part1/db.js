const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    // host: 'localhost',
    socketPath: "/var/run/mysqld/mysqld.sock",
    host: "127.0.0.1",
    user: 'root',
    // password: '',
    database: 'DogWalkService'
});

module.exports = pool;
