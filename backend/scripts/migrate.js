const { sequelize, RFP, Vendor, Proposal } = require('../models');

async function migrate() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established.');

    console.log('Running migrations...');
    await sequelize.sync({ force: false, alter: true });
    console.log('Migrations completed successfully.');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();
