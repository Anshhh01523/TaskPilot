const { Sequelize } = require('sequelize');
const path = require('path');

// Use :memory: on Vercel for instant response, project root locally
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel
  ? ':memory:'
  : path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize;
