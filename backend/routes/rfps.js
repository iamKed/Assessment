const express = require('express');
const router = express.Router();
const { RFP, Proposal, Vendor } = require('../models');
const { createRFPFromText, compareProposals } = require('../services/aiService');
const { sendRFPToVendors } = require('../services/emailService');

// Create RFP from natural language
router.post('/create-from-text', async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const structuredData = await createRFPFromText(description);

    const rfp = await RFP.create({
      ...structuredData,
      originalText: description,
      status: 'draft',
    });

    res.status(201).json(rfp);
  } catch (error) {
    next(error);
  }
});

// Get all RFPs
router.get('/', async (req, res, next) => {
  try {
    const rfps = await RFP.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Proposal,
          as: 'proposals',
          include: [{ model: Vendor, as: 'vendor' }],
        },
      ],
    });

    res.json(rfps);
  } catch (error) {
    next(error);
  }
});

// Get RFP by ID
router.get('/:id', async (req, res, next) => {
  try {
    const rfp = await RFP.findByPk(req.params.id, {
      include: [
        {
          model: Proposal,
          as: 'proposals',
          include: [{ model: Vendor, as: 'vendor' }],
        },
      ],
    });

    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    res.json(rfp);
  } catch (error) {
    next(error);
  }
});

// Update RFP
router.put('/:id', async (req, res, next) => {
  try {
    const rfp = await RFP.findByPk(req.params.id);

    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    await rfp.update(req.body);

    res.json(rfp);
  } catch (error) {
    next(error);
  }
});

// Send RFP to vendors
router.post('/:id/send', async (req, res, next) => {
  try {
    const { vendorIds } = req.body;

    if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({ error: 'vendorIds array is required' });
    }

    const rfp = await RFP.findByPk(req.params.id);

    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const vendors = await Vendor.findAll({
      where: { id: vendorIds },
    });

    if (vendors.length === 0) {
      return res.status(404).json({ error: 'No vendors found' });
    }

    const results = await sendRFPToVendors(rfp, vendors);

    // Update RFP status to 'sent'
    await rfp.update({ status: 'sent' });

    res.json({
      message: 'RFP sent to vendors',
      results,
    });
  } catch (error) {
    next(error);
  }
});

// Get proposals for RFP
router.get('/:id/proposals', async (req, res, next) => {
  try {
    const proposals = await Proposal.findAll({
      where: { rfpId: req.params.id },
      include: [{ model: Vendor, as: 'vendor' }],
      order: [['createdAt', 'DESC']],
    });

    res.json(proposals);
  } catch (error) {
    next(error);
  }
});

// Compare proposals for RFP
router.get('/:id/compare', async (req, res, next) => {
  try {
    const proposals = await Proposal.findAll({
      where: { rfpId: req.params.id },
      include: [{ model: Vendor, as: 'vendor' }],
    });

    if (proposals.length === 0) {
      return res.status(404).json({ error: 'No proposals found for this RFP' });
    }

    // Prepare data for comparison
    const proposalsData = proposals.map(p => ({
      vendorName: p.vendor.name,
      pricing: p.pricing,
      terms: p.terms,
      extractedData: p.extractedData,
      emailBody: p.emailBody,
    }));

    const comparison = await compareProposals(proposalsData);

    // Update proposals with AI scores and recommendations
    for (const proposal of proposals) {
      const vendorScore = comparison.scores[proposal.vendor.name];
      if (vendorScore !== undefined) {
        await proposal.update({
          aiScore: vendorScore,
          aiSummary: comparison.summary,
          aiRecommendation: comparison.recommendation,
        });
      }
    }

    res.json({
      comparison,
      proposals: proposals.map(p => ({
        ...p.toJSON(),
        strengths: comparison.strengths[p.vendor.name] || [],
        weaknesses: comparison.weaknesses[p.vendor.name] || [],
      })),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
