const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(() => console.log("Connected to Neon Postgres!"))
  .catch(err => console.error("Connection error", err));

module.exports = pool;