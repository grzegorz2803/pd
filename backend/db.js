const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'g_admin',
    password: 'zaq1@WSX',
    database: 'lso',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = pool.promise();