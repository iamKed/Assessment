# Project Structure

```
Assessment/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize database configuration
│   ├── models/
│   │   ├── index.js             # Model relationships
│   │   ├── RFP.js               # RFP model
│   │   ├── Vendor.js            # Vendor model
│   │   └── Proposal.js          # Proposal model
│   ├── routes/
│   │   ├── rfps.js              # RFP endpoints
│   │   ├── vendors.js           # Vendor endpoints
│   │   ├── proposals.js         # Proposal endpoints
│   │   └── email.js             # Email health check
│   ├── services/
│   │   ├── aiService.js         # Google Gemini AI integration
│   │   ├── emailService.js      # Email sending (SMTP)
│   │   └── emailPolling.js      # Email receiving (IMAP)
│   ├── scripts/
│   │   └── migrate.js           # Database migration script
│   ├── env.example              # Environment variables template
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js        # Axios API client
│   │   ├── components/
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── CreateRFP.js     # RFP creation form
│   │   │   ├── RFPDetail.js     # RFP details and sending
│   │   │   ├── Vendors.js       # Vendor management
│   │   │   └── CompareProposals.js # Proposal comparison
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # App styles
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   ├── env.example              # Frontend environment template
│   └── package.json             # Frontend dependencies
│
├── README.md                    # Main documentation
├── SETUP.md                     # Setup instructions
├── PROJECT_STRUCTURE.md         # This file
└── .gitignore                   # Git ignore rules

```

## Key Features Implementation

### Backend (Node.js/Express)

1. **RFP Management**
   - Create RFP from natural language (AI-powered)
   - CRUD operations for RFPs
   - Send RFPs to vendors via email

2. **Vendor Management**
   - CRUD operations for vendors
   - Vendor master data storage

3. **Proposal Management**
   - Automatic parsing of vendor responses (AI-powered)
   - Store extracted pricing and terms
   - Compare proposals (AI-powered)

4. **Email Integration**
   - SMTP for sending RFPs
   - IMAP polling for receiving responses
   - Automatic processing of vendor emails

5. **AI Integration**
   - Google Gemini AI for:
     - Natural language to structured RFP conversion
     - Vendor response parsing
     - Proposal comparison and recommendations

### Frontend (React)

1. **Dashboard**
   - List all RFPs
   - Show RFP status and proposal counts
   - Quick navigation

2. **RFP Creation**
   - Natural language input form
   - Display structured RFP after creation
   - Edit and view RFP details

3. **Vendor Management**
   - Add/edit/delete vendors
   - Vendor list view

4. **RFP Details**
   - View full RFP information
   - Select vendors and send RFP
   - View received proposals

5. **Proposal Comparison**
   - Side-by-side comparison view
   - AI-generated scores and recommendations
   - Strengths and weaknesses analysis

## Database Schema

### RFPs Table
- id (PK)
- title
- description
- budget (DECIMAL)
- deadline (DATE)
- requirements (JSONB)
- paymentTerms
- warranty
- status (draft/sent/closed)
- originalText
- timestamps

### Vendors Table
- id (PK)
- name
- email (unique)
- contactPerson
- phone
- address
- timestamps

### Proposals Table
- id (PK)
- rfpId (FK)
- vendorId (FK)
- emailBody
- extractedData (JSONB)
- pricing (JSONB)
- terms (JSONB)
- aiSummary
- aiScore (DECIMAL)
- aiRecommendation
- status (received/reviewed/accepted/rejected)
- timestamps

## API Endpoints Summary

### RFPs
- POST `/api/rfps/create-from-text` - Create RFP from natural language
- GET `/api/rfps` - Get all RFPs
- GET `/api/rfps/:id` - Get RFP by ID
- PUT `/api/rfps/:id` - Update RFP
- POST `/api/rfps/:id/send` - Send RFP to vendors
- GET `/api/rfps/:id/proposals` - Get proposals for RFP
- GET `/api/rfps/:id/compare` - Compare proposals

### Vendors
- POST `/api/vendors` - Create vendor
- GET `/api/vendors` - Get all vendors
- GET `/api/vendors/:id` - Get vendor by ID
- PUT `/api/vendors/:id` - Update vendor
- DELETE `/api/vendors/:id` - Delete vendor

### Proposals
- GET `/api/proposals` - Get all proposals
- GET `/api/proposals/:id` - Get proposal by ID
- POST `/api/proposals/parse-email` - Manually parse email response
- PUT `/api/proposals/:id/status` - Update proposal status
