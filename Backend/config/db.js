const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",  // Change if needed
    password: "Pradnya@1245",
    database: "PCCOELibraryDB",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool.promise(); //  Add .promise() for async/await support
