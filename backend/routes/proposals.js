const express = require('express');
const router = express.Router();
const { Proposal, RFP, Vendor } = require('../models');
const { parseVendorResponse } = require('../services/aiService');

// Get all proposals
router.get('/', async (req, res, next) => {
  try {
    const proposals = await Proposal.findAll({
      include: [
        { model: RFP, as: 'rfp' },
        { model: Vendor, as: 'vendor' },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(proposals);
  } catch (error) {
    next(error);
  }
});

// Get proposal by ID
router.get('/:id', async (req, res, next) => {
  try {
    const proposal = await Proposal.findByPk(req.params.id, {
      include: [
        { model: RFP, as: 'rfp' },
        { model: Vendor, as: 'vendor' },
      ],
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    res.json(proposal);
  } catch (error) {
    next(error);
  }
});

// Manually parse email response (for testing or manual processing)
router.post('/parse-email', async (req, res, next) => {
  try {
    const { rfpId, vendorId, emailBody } = req.body;

    if (!rfpId || !vendorId || !emailBody) {
      return res.status(400).json({ error: 'rfpId, vendorId, and emailBody are required' });
    }

    const rfp = await RFP.findByPk(rfpId);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const extractedData = await parseVendorResponse(emailBody, rfp);

    const proposal = await Proposal.create({
      rfpId,
      vendorId,
      emailBody,
      extractedData,
      pricing: extractedData.pricing || {},
      terms: {
        deliveryTime: extractedData.deliveryTime,
        paymentTerms: extractedData.paymentTerms,
        warranty: extractedData.warranty,
        additionalTerms: extractedData.additionalTerms,
      },
      status: 'received',
    });

    res.status(201).json(proposal);
  } catch (error) {
    next(error);
  }
});

// Update proposal status
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['received', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const proposal = await Proposal.findByPk(req.params.id);

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    await proposal.update({ status });

    res.json(proposal);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
