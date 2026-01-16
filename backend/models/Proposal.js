const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proposal = sequelize.define('Proposal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rfpId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rfps',
      key: 'id',
    },
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendors',
      key: 'id',
    },
  },
  emailBody: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  extractedData: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  pricing: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  terms: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  aiSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  aiScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  aiRecommendation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'received',
    validate: {
      isIn: [['received', 'reviewed', 'accepted', 'rejected']],
    },
  },
}, {
  tableName: 'proposals',
  timestamps: true,
});

module.exports = Proposal;
