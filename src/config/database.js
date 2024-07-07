const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'Shakiti19', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5000, // default PostgreSQL port
});

module.exports = sequelize;
