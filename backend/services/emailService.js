const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send RFP email to vendors
 */
async function sendRFPToVendors(rfp, vendors) {
  const emailPromises = vendors.map(async (vendor) => {
    const emailBody = generateRFPEmailBody(rfp);

    try {
      const info = await transporter.sendMail({
        from: `"RFP Management System" <${process.env.SMTP_FROM}>`,
        to: vendor.email,
        subject: `RFP: ${rfp.title}`,
        html: emailBody,
        text: generateRFPEmailText(rfp),
      });

      console.log(`RFP sent to ${vendor.email}: ${info.messageId}`);
      return { vendorId: vendor.id, success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send RFP to ${vendor.email}:`, error);
      return { vendorId: vendor.id, success: false, error: error.message };
    }
  });

  return Promise.all(emailPromises);
}

/**
 * Generate HTML email body for RFP
 */
function generateRFPEmailBody(rfp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; }
        .requirement { background-color: white; padding: 10px; margin: 10px 0; border-left: 4px solid #4CAF50; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Request for Proposal</h1>
        </div>
        <div class="content">
          <div class="section">
            <h2>${rfp.title}</h2>
            <p>${rfp.description}</p>
          </div>
          
          ${rfp.budget ? `<div class="section"><h3>Budget</h3><p>$${parseFloat(rfp.budget).toLocaleString()}</p></div>` : ''}
          
          ${rfp.deadline ? `<div class="section"><h3>Deadline</h3><p>${new Date(rfp.deadline).toLocaleDateString()}</p></div>` : ''}
          
          ${rfp.requirements && rfp.requirements.length > 0 ? `
            <div class="section">
              <h3>Requirements</h3>
              ${rfp.requirements.map(req => `
                <div class="requirement">
                  <strong>${req.item}</strong> - Quantity: ${req.quantity || 'N/A'}<br>
                  ${req.specifications ? Object.entries(req.specifications).map(([key, value]) => `${key}: ${value}`).join(', ') : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${rfp.paymentTerms ? `<div class="section"><h3>Payment Terms</h3><p>${rfp.paymentTerms}</p></div>` : ''}
          
          ${rfp.warranty ? `<div class="section"><h3>Warranty Requirements</h3><p>${rfp.warranty}</p></div>` : ''}
          
          <div class="section">
            <h3>Response Instructions</h3>
            <p>Please reply to this email with your proposal including:</p>
            <ul>
              <li>Itemized pricing</li>
              <li>Delivery timeline</li>
              <li>Payment terms</li>
              <li>Warranty information</li>
              <li>Any additional terms or conditions</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated RFP from the RFP Management System.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email for RFP
 */
function generateRFPEmailText(rfp) {
  let text = `REQUEST FOR PROPOSAL\n\n`;
  text += `${rfp.title}\n\n`;
  text += `${rfp.description}\n\n`;
  
  if (rfp.budget) {
    text += `Budget: $${parseFloat(rfp.budget).toLocaleString()}\n`;
  }
  
  if (rfp.deadline) {
    text += `Deadline: ${new Date(rfp.deadline).toLocaleDateString()}\n`;
  }
  
  if (rfp.requirements && rfp.requirements.length > 0) {
    text += `\nRequirements:\n`;
    rfp.requirements.forEach(req => {
      text += `- ${req.item} (Quantity: ${req.quantity || 'N/A'})\n`;
      if (req.specifications) {
        Object.entries(req.specifications).forEach(([key, value]) => {
          text += `  ${key}: ${value}\n`;
        });
      }
    });
  }
  
  if (rfp.paymentTerms) {
    text += `\nPayment Terms: ${rfp.paymentTerms}\n`;
  }
  
  if (rfp.warranty) {
    text += `Warranty Requirements: ${rfp.warranty}\n`;
  }
  
  text += `\nPlease reply to this email with your proposal.\n`;
  
  return text;
}

module.exports = {
  sendRFPToVendors,
};
