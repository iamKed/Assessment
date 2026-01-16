# AI-Powered RFP Management System

A single-user web application that streamlines the Request for Proposal (RFP) workflow from creation to vendor comparison using AI assistance.

## Features

- **Natural Language RFP Creation**: Describe procurement needs in plain English, and the system converts it to a structured RFP
- **Vendor Management**: Maintain vendor master data and select vendors for RFPs
- **Email Integration**: Send RFPs to vendors via email and receive responses automatically
- **AI-Powered Response Parsing**: Automatically extract structured data from vendor responses (prices, terms, conditions)
- **Proposal Comparison**: Compare multiple vendor proposals with AI-assisted evaluation and recommendations

## Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM

### AI Integration
- Google Gemini AI

### Email
- Nodemailer (SMTP for sending)
- IMAP (for receiving)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Google Gemini API key
- Email account with SMTP/IMAP access (Gmail recommended)

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Assessment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
- Database credentials
- Google Gemini API key
- Email credentials (SMTP and IMAP)

### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb rfp_management
```

Run migrations:

```bash
cd backend
npm run migrate
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

### 5. Running the Application

**Backend:**
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`

**Frontend:**
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## API Documentation

### RFPs

#### Create RFP from Natural Language
```
POST /api/rfps/create-from-text
Content-Type: application/json

{
  "description": "I need to procure laptops and monitors for our new office. Budget is $50,000 total..."
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Laptops and Monitors Procurement",
  "description": "...",
  "budget": 50000,
  "deadline": "2024-02-15",
  "requirements": [...],
  "status": "draft"
}
```

#### Get All RFPs
```
GET /api/rfps
```

#### Get RFP by ID
```
GET /api/rfps/:id
```

#### Update RFP
```
PUT /api/rfps/:id
Content-Type: application/json

{
  "title": "...",
  "budget": 50000,
  ...
}
```

### Vendors

#### Create Vendor
```
POST /api/vendors
Content-Type: application/json

{
  "name": "Vendor Name",
  "email": "vendor@example.com",
  "contactPerson": "John Doe",
  "phone": "+1234567890"
}
```

#### Get All Vendors
```
GET /api/vendors
```

#### Get Vendor by ID
```
GET /api/vendors/:id
```

### Proposals

#### Get Proposals for RFP
```
GET /api/rfps/:rfpId/proposals
```

#### Get Proposal by ID
```
GET /api/proposals/:id
```

#### Parse Email Response (Internal)
```
POST /api/proposals/parse-email
Content-Type: application/json

{
  "rfpId": 1,
  "vendorId": 1,
  "emailBody": "...",
  "attachments": [...]
}
```

### Email

#### Send RFP to Vendors
```
POST /api/rfps/:rfpId/send
Content-Type: application/json

{
  "vendorIds": [1, 2, 3]
}
```

## Decisions & Assumptions

### Data Model

**RFP Structure:**
- Title, description, budget, deadline
- Requirements (array of items with specifications)
- Payment terms, warranty requirements
- Status (draft, sent, closed)

**Proposal Structure:**
- Linked to RFP and Vendor
- Extracted data: pricing breakdown, terms, conditions
- Raw email content for reference
- AI-generated summary and score

### AI Integration

1. **RFP Creation**: Uses Google Gemini AI to extract structured data from natural language descriptions
2. **Response Parsing**: Parses vendor emails/attachments to extract pricing, terms, and conditions
3. **Comparison**: Generates summaries, scores proposals, and provides recommendations

### Email Handling

- **Sending**: Uses SMTP (Nodemailer) to send formatted RFP emails
- **Receiving**: IMAP polling checks for new emails and processes vendor responses
- Assumes vendor responses contain pricing/terms in email body or attachments

### Limitations

- Single-user system (no authentication)
- Email polling interval: 5 minutes (configurable)
- PDF parsing requires text extraction (may not handle scanned PDFs perfectly)
- AI parsing accuracy depends on email format consistency

## AI Tools Usage

This project was built using AI assistance throughout the development process:

### Tools Used
- **Cursor AI**: Primary development assistant for code generation, architecture decisions, and debugging
- **Google Gemini AI**: Integrated into the application for RFP creation, response parsing, and recommendation features

### What AI Helped With

1. **Boilerplate Code**: Generated initial project structure, Express routes, React components, and database models
2. **Architecture Design**: Assisted in designing the data models (RFP, Vendor, Proposal relationships) and API structure
3. **AI Integration**: Helped design prompts for Google Gemini API integration, including:
   - Natural language to structured RFP conversion
   - Vendor response parsing from unstructured emails
   - Proposal comparison and recommendation logic
4. **Debugging**: Assisted in identifying and fixing issues with Sequelize models, email parsing, and React state management
5. **Code Organization**: Helped structure the codebase with clear separation between services, routes, and models

### Notable Prompts/Approaches

**For RFP Creation:**
```
"Extract structured RFP data from natural language procurement description. 
Return JSON with title, budget, deadline, requirements array, payment terms, and warranty."
```

**For Response Parsing:**
```
"Parse vendor proposal email and extract pricing breakdown, delivery timeline, 
payment terms, warranty, and completeness score (0-100)."
```

**For Comparison:**
```
"Compare multiple vendor proposals and provide summary, scores, recommendation, 
strengths, and weaknesses for each vendor."
```

### What Was Learned/Changed

- **Prompt Engineering**: Iteratively refined prompts to ensure consistent JSON output from Google Gemini AI
- **Error Handling**: Added robust error handling for AI API failures with fallback messages
- **Data Validation**: Implemented validation to ensure AI-extracted data matches expected schema
- **Temperature Settings**: Used lower temperature (0.3) for extraction tasks and higher (0.5) for comparison to balance accuracy and creativity

## Next Steps

- Add email attachment parsing (PDF, Word docs)
- Implement real-time email notifications
- Add proposal scoring algorithm refinement
- Support for RFP templates
- Export comparison reports to PDF
