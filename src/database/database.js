  //import postgreSQL module
  const { Pool } = require('pg');

  //database connection
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  })
  //exporting 
  module.exports = pool;