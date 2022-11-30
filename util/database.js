const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete", // name of created schema
  password: "lokalsoul",
});

module.exports = pool.promise();
