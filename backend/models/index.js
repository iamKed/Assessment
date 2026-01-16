const sequelize = require('../config/database');
const RFP = require('./RFP');
const Vendor = require('./Vendor');
const Proposal = require('./Proposal');

// Define relationships
RFP.hasMany(Proposal, { foreignKey: 'rfpId', as: 'proposals' });
Proposal.belongsTo(RFP, { foreignKey: 'rfpId', as: 'rfp' });

Vendor.hasMany(Proposal, { foreignKey: 'vendorId', as: 'proposals' });
Proposal.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

module.exports = {
  sequelize,
  RFP,
  Vendor,
  Proposal,
};
