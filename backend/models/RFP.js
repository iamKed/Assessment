const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RFP = sequelize.define('RFP', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  paymentTerms: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  warranty: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'draft',
    validate: {
      isIn: [['draft', 'sent', 'closed']],
    },
  },
  originalText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'rfps',
  timestamps: true,
});

module.exports = RFP;
