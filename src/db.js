const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // replace with your PostgreSQL username
  host: 'localhost',             // replace with your database host (usually 'localhost' for local development)
  database: 'postgres',// replace with your PostgreSQL database name
  password: 'Shakiti19',     // replace with your PostgreSQL password
  port: 5000,                    // replace with your PostgreSQL port (default is 5432)
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
