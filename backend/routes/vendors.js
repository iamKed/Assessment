const express = require('express');
const router = express.Router();
const { Vendor, Proposal, RFP } = require('../models');

// Create vendor
router.post('/', async (req, res, next) => {
  try {
    const { name, email, contactPerson, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const vendor = await Vendor.create({
      name,
      email,
      contactPerson,
      phone,
      address,
    });

    res.status(201).json(vendor);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Vendor with this email already exists' });
    }
    next(error);
  }
});

// Get all vendors (with proposal counts)
router.get('/', async (req, res, next) => {
  try {
    const vendors = await Vendor.findAll({
      include: [
        {
          model: Proposal,
          as: 'proposals',
          attributes: ['id', 'rfpId', 'status', 'createdAt'],
          required: false,
        },
      ],
      order: [['name', 'ASC']],
    });

    // Add proposal count to each vendor
    const vendorsWithCounts = vendors.map(vendor => {
      const vendorJson = vendor.toJSON();
      vendorJson.proposalCount = vendorJson.proposals?.length || 0;
      vendorJson.rfpCount = new Set(vendorJson.proposals?.map(p => p.rfpId) || []).size;
      return vendorJson;
    });

    res.json(vendorsWithCounts);
  } catch (error) {
    next(error);
  }
});

// Get vendor by ID with proposals
router.get('/:id', async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id, {
      include: [
        {
          model: Proposal,
          as: 'proposals',
          include: [
            {
              model: RFP,
              as: 'rfp',
            },
          ],
        },
      ],
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Sort proposals by creation date (newest first)
    const vendorJson = vendor.toJSON();
    if (vendorJson.proposals) {
      vendorJson.proposals.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    res.json(vendorJson);
  } catch (error) {
    next(error);
  }
});

// Update vendor
router.put('/:id', async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    await vendor.update(req.body);

    res.json(vendor);
  } catch (error) {
    next(error);
  }
});

// Get all proposals for a vendor
router.get('/:id/proposals', async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const proposals = await Proposal.findAll({
      where: { vendorId: req.params.id },
      include: [
        {
          model: RFP,
          as: 'rfp',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(proposals);
  } catch (error) {
    next(error);
  }
});

// Delete vendor
router.delete('/:id', async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    await vendor.destroy();

    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
