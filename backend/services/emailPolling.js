const Imap = require('imap');
const { simpleParser } = require('mailparser');
const dotenv = require('dotenv');
const { Proposal, RFP, Vendor } = require('../models');
const { parseVendorResponse } = require('./aiService');

dotenv.config();

let imap;

function connectIMAP() {
  imap = new Imap({
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT),
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });

  imap.once('ready', () => {
    console.log('IMAP connection ready');
    checkEmails();
  });

  imap.once('error', (err) => {
    console.error('IMAP error:', err);
  });

  imap.once('end', () => {
    console.log('IMAP connection ended');
  });

  imap.connect();
}

function checkEmails() {
  imap.openBox('INBOX', false, (err, box) => {
    if (err) {
      console.error('Error opening inbox:', err);
      return;
    }

    // Search for unread emails
    imap.search(['UNSEEN'], (err, results) => {
      if (err) {
        console.error('Error searching emails:', err);
        return;
      }

      if (!results || results.length === 0) {
        console.log('No new emails found');
        return;
      }

      console.log(`Found ${results.length} new email(s)`);

      const fetch = imap.fetch(results, { bodies: '', struct: true });

      fetch.on('message', (msg, seqno) => {
        msg.on('body', (stream, info) => {
          simpleParser(stream, async (err, parsed) => {
            if (err) {
              console.error('Error parsing email:', err);
              return;
            }

            try {
              await processVendorResponse(parsed);
            } catch (error) {
              console.error('Error processing vendor response:', error);
            }
          });
        });
      });

      fetch.once('end', () => {
        console.log('Finished processing emails');
      });
    });
  });
}

async function processVendorResponse(email) {
  const fromEmail = email.from.value[0].address;
  const subject = email.subject || '';
  const body = email.text || email.html || '';

  console.log(`Processing email from: ${fromEmail}, Subject: ${subject}`);

  // Find vendor by email
  const vendor = await Vendor.findOne({ where: { email: fromEmail } });
  
  if (!vendor) {
    console.log(`Vendor not found for email: ${fromEmail}`);
    return;
  }

  // Try to find RFP from subject or email content
  // Look for RFP ID or title in subject
  const rfpIdMatch = subject.match(/RFP[:\s]*#?(\d+)/i);
  let rfp;

  if (rfpIdMatch) {
    rfp = await RFP.findByPk(parseInt(rfpIdMatch[1]));
  } else {
    // Try to find by title in subject
    const rfps = await RFP.findAll({ where: { status: 'sent' } });
    rfp = rfps.find(r => subject.includes(r.title));
  }

  if (!rfp) {
    console.log(`RFP not found for email from ${fromEmail}`);
    return;
  }

  // Allow vendors to submit multiple proposals to the same RFP
  // (e.g., updated proposals, revised quotes)
  // Parse email with AI
  const extractedData = await parseVendorResponse(body, rfp);

  // Create proposal
  const proposal = await Proposal.create({
    rfpId: rfp.id,
    vendorId: vendor.id,
    emailBody: body,
    extractedData: extractedData,
    pricing: extractedData.pricing || {},
    terms: {
      deliveryTime: extractedData.deliveryTime,
      paymentTerms: extractedData.paymentTerms,
      warranty: extractedData.warranty,
      additionalTerms: extractedData.additionalTerms,
    },
    status: 'received',
  });

  const proposalCount = await Proposal.count({
    where: { rfpId: rfp.id, vendorId: vendor.id },
  });
  console.log(`Created proposal ${proposal.id} for RFP ${rfp.id} from vendor ${vendor.name} (Total proposals from this vendor for this RFP: ${proposalCount})`);
}

function start() {
  if (!process.env.IMAP_USER || !process.env.IMAP_PASSWORD) {
    console.log('IMAP credentials not configured. Email polling disabled.');
    return;
  }

  connectIMAP();

  // Poll every 5 minutes
  setInterval(() => {
    if (imap && imap.state === 'authenticated') {
      checkEmails();
    } else {
      connectIMAP();
    }
  }, 5 * 60 * 1000);
}

module.exports = {
  start,
};
