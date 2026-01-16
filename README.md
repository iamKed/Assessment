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
- **Framework**: React 18.2.0
- **Routing**: React Router 6.20.0
- **HTTP Client**: Axios 1.6.2
- **Styling**: CSS3 (Custom styling, no framework)
- **Build Tool**: Create React App (react-scripts 5.0.1)

### Backend
- **Runtime**: Node.js 18+ (LTS recommended)
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL 14+ with Sequelize 6.35.0 ORM
- **Process Manager**: Nodemon 3.0.2 (development)

### AI Integration
- **Primary AI Provider**: Google Gemini API
- **Model**: gemini-3-flash-preview
- **Library**: @google/generative-ai 0.21.0
- **Purpose**: RFP creation, response parsing, proposal comparison, and recommendations

### Email Integration
- **SMTP (Sending)**: Nodemailer 6.9.7
- **IMAP (Receiving)**: imap 0.8.19
- **Email Parsing**: mailparser 3.6.5
- **Supported Providers**: Gmail (recommended), Outlook, any SMTP/IMAP provider

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 14 or higher
- **Git**: For cloning the repository

### Required API Keys & Accounts
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Email Account**: Gmail or other provider supporting SMTP/IMAP
  - For Gmail: You'll need an [App Password](https://myaccount.google.com/apppasswords) (2FA required)

### Installation Verification
```bash
# Verify Node.js installation
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher

# Verify PostgreSQL installation
psql --version  # Should be PostgreSQL 14 or higher
```

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Assessment
```

### 2. Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables
```bash
# Copy the example environment file
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_HOST=localhost          # PostgreSQL server host
DB_PORT=5432              # PostgreSQL server port
DB_NAME=rfp_management    # Database name to create
DB_USER=postgres          # PostgreSQL username
DB_PASSWORD=postgres      # PostgreSQL password

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here  # From https://makersuite.google.com/app/apikey

# Email Configuration (SMTP for sending)
SMTP_HOST=smtp.gmail.com             # SMTP server address
SMTP_PORT=587                        # SMTP port (587 for TLS, 465 for SSL)
SMTP_USER=your_email@gmail.com       # Email address
SMTP_PASSWORD=your_app_password_here # App-specific password (not regular password)
SMTP_FROM=your_email@gmail.com       # From address for RFP emails

# Email Configuration (IMAP for receiving)
IMAP_HOST=imap.gmail.com             # IMAP server address
IMAP_PORT=993                        # IMAP port
IMAP_USER=your_email@gmail.com       # Email address
IMAP_PASSWORD=your_app_password_here # App-specific password
```

**Gmail Setup Instructions:**
1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or your device)
4. Use the generated password in `.env` for both SMTP and IMAP

#### 2.3 Setup PostgreSQL Database
```bash
# Create the database
createdb rfp_management

# Run database migrations
npm run migrate
```

If you need to reset the database:
```bash
dropdb rfp_management
createdb rfp_management
npm run migrate
```

### 3. Frontend Setup

#### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Configure Environment Variables
```bash
# Copy the example environment file
cp env.example .env
```

Edit `.env` (default should work if backend is on localhost:3001):
```env
REACT_APP_API_URL=http://localhost:3001
```

For production deployment, update to your backend URL:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### 4. Running the Application Locally

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
```

Expected output:
```
> rfp-management-backend@1.0.0 dev
> nodemon server.js

Server running on port 3001
Database connection established.
IMAP connection ready
```

**Terminal 2 - Start Frontend Development Server:**
```bash
cd frontend
npm start
```

The application will automatically open at `http://localhost:3000`

### 5. Verify Installation

1. **Backend Health Check**: Visit http://localhost:3001/health
   - Should return: `{"status":"ok","message":"RFP Management API is running"}`

2. **Frontend**: Visit http://localhost:3000
   - Should see the RFP Management System UI with Dashboard, Create RFP, and Vendors tabs

3. **Database**: Check connection
   ```bash
   psql -U postgres -d rfp_management -c "SELECT 1;"
   ```
   - Should return: `?column? | 1`

## Testing the Setup

Follow these steps to verify everything is working:

1. **Create a Vendor**
   - Navigate to "Vendors" tab
   - Click "Add Vendor"
   - Enter: Name (e.g., "Tech Corp"), Email (e.g., vendor@techcorp.com), Contact Person, Phone
   - Click "Create Vendor"

2. **Create an RFP from Natural Language**
   - Navigate to "Create RFP" tab
   - Enter a procurement description like:
     ```
     We need 20 laptops with Intel i7, 16GB RAM, 512GB SSD for our engineering team.
     Budget: $30,000. Need delivery within 2 weeks. Payment terms: Net 30.
     Warranty required: 2 years.
     ```
   - Click "Create RFP"
   - Verify the system extracted: Title, Budget, Requirements, Deadline, Payment Terms

3. **Send RFP to Vendor**
   - From the created RFP, scroll down to "Send RFP to Vendors"
   - Select the vendor you created
   - Click "Send RFP to 1 Vendor(s)"
   - Check backend logs for: `RFP sent to [vendor-email]: [messageId]`

4. **Verify Email Integration**
   - Check that an email was sent from your configured SMTP account to the vendor
   - Response parsing works when vendor replies to the RFP email (check IMAP polling logs)

5. **Compare Proposals** (after receiving vendor responses)
   - Return to the RFP details
   - Click "Compare Proposals" button
   - Verify AI-generated comparison, scores, and recommendations are displayed

## API Documentation

All API endpoints are prefixed with `/api` and return JSON responses.

### RFPs

#### Create RFP from Natural Language
Creates an RFP by extracting structured data from natural language description using Google Gemini AI.

```
POST /api/rfps/create-from-text
Content-Type: application/json
```

**Request:**
```json
{
  "description": "We need 20 laptops for our engineering team. Each should have Intel i7, 16GB RAM, and 512GB SSD. Budget is $30,000. We need delivery within 2 weeks. Payment terms should be Net 30, and we need 2-year warranty coverage."
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "title": "Engineering Team Laptops Procurement",
  "description": "We need 20 laptops...",
  "budget": 30000.00,
  "deadline": "2024-02-15",
  "requirements": [
    {
      "item": "Laptop",
      "quantity": 20,
      "specifications": {
        "processor": "Intel i7",
        "RAM": "16GB",
        "storage": "512GB SSD"
      }
    }
  ],
  "paymentTerms": "Net 30",
  "warranty": "2-year warranty coverage",
  "status": "draft",
  "originalText": "We need 20 laptops...",
  "createdAt": "2024-01-16T10:30:00Z",
  "updatedAt": "2024-01-16T10:30:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "Description is required"
}
```

---

#### Get All RFPs
Retrieves all RFPs with their associated proposals.

```
GET /api/rfps
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "Engineering Team Laptops Procurement",
    "description": "...",
    "budget": 30000.00,
    "status": "draft",
    "proposals": [
      {
        "id": 1,
        "status": "received",
        "vendor": { "id": 1, "name": "Tech Corp" }
      }
    ],
    "createdAt": "2024-01-16T10:30:00Z"
  }
]
```

---

#### Get RFP by ID
Retrieves a specific RFP with all its details and proposals.

```
GET /api/rfps/:id
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Engineering Team Laptops Procurement",
  "description": "...",
  "budget": 30000.00,
  "deadline": "2024-02-15",
  "requirements": [...],
  "paymentTerms": "Net 30",
  "warranty": "2-year warranty coverage",
  "status": "draft",
  "proposals": [
    {
      "id": 1,
      "vendor": { "id": 1, "name": "Tech Corp", "email": "vendor@techcorp.com" },
      "status": "received",
      "pricing": { ... },
      "terms": { ... },
      "aiScore": 85
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "RFP not found"
}
```

---

#### Update RFP
Updates RFP details.

```
PUT /api/rfps/:id
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Updated Title",
  "budget": 35000.00
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "budget": 35000.00,
  ...
}
```

---

#### Send RFP to Vendors
Sends the RFP to selected vendors via email.

```
POST /api/rfps/:id/send
Content-Type: application/json
```

**Request:**
```json
{
  "vendorIds": [1, 2, 3]
}
```

**Success Response (200):**
```json
{
  "message": "RFP sent to vendors",
  "results": [
    {
      "vendorId": 1,
      "success": true,
      "messageId": "<messageId@example.com>"
    },
    {
      "vendorId": 2,
      "success": false,
      "error": "Email delivery failed"
    }
  ]
}
```

---

#### Compare Proposals
Compares all proposals for an RFP and generates AI-powered analysis and recommendations.

```
GET /api/rfps/:id/compare
```

**Success Response (200):**
```json
{
  "comparison": {
    "summary": "Tech Corp offers the most competitive pricing at $28,500 with strong technical specifications. DataCorp provides excellent support terms but at a premium price.",
    "scores": {
      "Tech Corp": 92,
      "DataCorp": 78,
      "CloudVendor": 65
    },
    "recommendation": "Tech Corp is recommended based on competitive pricing, 2-year warranty match, 2-week delivery timeline, and overall best value for the stated requirements.",
    "strengths": {
      "Tech Corp": ["Competitive pricing", "Fast delivery", "Good warranty coverage"],
      "DataCorp": ["Premium support", "Flexible payment terms"]
    },
    "weaknesses": {
      "Tech Corp": ["Limited warranty extensions"],
      "DataCorp": ["Higher price point"]
    }
  },
  "proposals": [
    {
      "id": 1,
      "vendor": { "id": 1, "name": "Tech Corp" },
      "pricing": { "totalPrice": 28500.00, "discount": "5%" },
      "terms": { "deliveryTime": "2 weeks", "paymentTerms": "Net 30", "warranty": "2 years" },
      "aiScore": 92,
      "strengths": ["Competitive pricing", "Fast delivery"],
      "weaknesses": []
    }
  ]
}
```

---

### Vendors

#### Create Vendor
Adds a new vendor to the system.

```
POST /api/vendors
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Tech Corp",
  "email": "sales@techcorp.com",
  "contactPerson": "John Smith",
  "phone": "+1-555-0100",
  "address": "123 Tech Street, San Francisco, CA 94105"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "name": "Tech Corp",
  "email": "sales@techcorp.com",
  "contactPerson": "John Smith",
  "phone": "+1-555-0100",
  "address": "123 Tech Street, San Francisco, CA 94105",
  "createdAt": "2024-01-16T10:30:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "Vendor with this email already exists"
}
```

---

#### Get All Vendors
Retrieves all vendors with proposal counts.

```
GET /api/vendors
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Tech Corp",
    "email": "sales@techcorp.com",
    "contactPerson": "John Smith",
    "phone": "+1-555-0100",
    "address": "123 Tech Street, San Francisco, CA 94105",
    "proposalCount": 3,
    "rfpCount": 2,
    "createdAt": "2024-01-16T10:30:00Z"
  }
]
```

---

#### Get Vendor by ID
Retrieves a specific vendor with all their proposals.

```
GET /api/vendors/:id
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Tech Corp",
  "email": "sales@techcorp.com",
  "proposals": [
    {
      "id": 1,
      "rfpId": 1,
      "status": "received",
      "pricing": { ... },
      "terms": { ... },
      "createdAt": "2024-01-16T10:30:00Z"
    }
  ]
}
```

---

#### Update Vendor
Updates vendor details.

```
PUT /api/vendors/:id
Content-Type: application/json
```

**Request:**
```json
{
  "contactPerson": "Jane Doe",
  "phone": "+1-555-0200"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Tech Corp",
  "email": "sales@techcorp.com",
  "contactPerson": "Jane Doe",
  "phone": "+1-555-0200",
  ...
}
```

---

#### Delete Vendor
Removes a vendor from the system.

```
DELETE /api/vendors/:id
```

**Success Response (200):**
```json
{
  "message": "Vendor deleted successfully"
}
```

---

### Proposals

#### Get All Proposals
Retrieves all proposals across all RFPs.

```
GET /api/proposals
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "rfpId": 1,
    "vendorId": 1,
    "status": "received",
    "aiScore": 92,
    "pricing": { "totalPrice": 28500.00 },
    "terms": { "deliveryTime": "2 weeks", "paymentTerms": "Net 30" },
    "rfp": { "id": 1, "title": "Engineering Team Laptops Procurement" },
    "vendor": { "id": 1, "name": "Tech Corp" }
  }
]
```

---

#### Get Proposal by ID
Retrieves a specific proposal with full details.

```
GET /api/proposals/:id
```

**Success Response (200):**
```json
{
  "id": 1,
  "rfpId": 1,
  "vendorId": 1,
  "status": "received",
  "emailBody": "Thank you for the RFP...",
  "extractedData": { ... },
  "pricing": { "totalPrice": 28500.00, "discount": "5%" },
  "terms": { "deliveryTime": "2 weeks", "paymentTerms": "Net 30", "warranty": "2 years" },
  "aiScore": 92,
  "aiSummary": "Strong proposal with competitive pricing",
  "rfp": { "id": 1, "title": "..." },
  "vendor": { "id": 1, "name": "Tech Corp" }
}
```

---

#### Parse Email Response (Manual)
Manually parses a vendor email response and creates a proposal.

```
POST /api/proposals/parse-email
Content-Type: application/json
```

**Request:**
```json
{
  "rfpId": 1,
  "vendorId": 1,
  "emailBody": "Thank you for your RFP. We can supply 20 laptops with the specified configuration for $28,500. Delivery within 2 weeks. Payment terms: Net 30. 2-year warranty included."
}
```

**Success Response (201):**
```json
{
  "id": 2,
  "rfpId": 1,
  "vendorId": 1,
  "status": "received",
  "pricing": { "totalPrice": 28500.00 },
  "terms": { "deliveryTime": "2 weeks", "paymentTerms": "Net 30", "warranty": "2-year warranty" }
}
```

---

#### Update Proposal Status
Updates the status of a proposal.

```
PUT /api/proposals/:id/status
Content-Type: application/json
```

**Request:**
```json
{
  "status": "accepted"
}
```

Valid status values: `received`, `reviewed`, `accepted`, `rejected`

**Success Response (200):**
```json
{
  "id": 1,
  "status": "accepted",
  ...
}
```

---

### Health Check

#### API Health Check
Verifies that the backend server is running.

```
GET /health
```

**Success Response (200):**
```json
{
  "status": "ok",
  "message": "RFP Management API is running"
}
```

## Decisions & Assumptions

### Data Model Design

**RFP Structure:**
- **Title & Description**: Extracted by AI from natural language input
- **Budget**: Numeric value in decimal format for precise financial tracking
- **Deadline**: ISO date format for standardized date handling
- **Requirements**: JSONB array allowing flexible structure with item name, quantity, and nested specifications dictionary
- **Payment Terms & Warranty**: String fields for flexible term definitions
- **Status Lifecycle**: Draft → Sent → Closed (prevents circular state transitions)
- **originalText**: Preserved for audit trail and re-processing capability

**Proposal Structure:**
- **Linked Relationships**: Foreign keys to both RFP and Vendor for proper data integrity
- **extractedData**: JSONB field storing full AI parsing result for audit and manual review
- **pricing & terms**: Separate JSONB fields for easier querying and analysis
- **AI Scoring**: Score range 0-100 for consistent recommendation logic
- **Status Lifecycle**: Received → Reviewed → Accepted/Rejected for proposal management workflow
- **Timestamps**: Automatic timestamps for tracking proposal submission and updates

**Vendor Structure:**
- **Unique Email**: Prevents duplicate vendor entries, email is contact method
- **Optional Fields**: Contact person, phone, address stored for manual outreach if email fails
- **Minimal Auth**: No user authentication as system is single-user

### AI Integration Strategy

**RFP Creation (Google Gemini):**
- Prompt engineering to extract: title, budget, deadline, requirements with specifications
- Temperature 0.3 for accurate deterministic extraction
- JSON response format enforcement to avoid parsing errors
- Error handling with JSON validation and fallback messages

**Response Parsing (Google Gemini):**
- Analyzes email body text to extract pricing breakdown, delivery timeline, payment terms, warranty
- Calculates completeness score (0-100) for proposal-to-RFP alignment
- Captures both structured data and weakly-structured content
- Stores raw email for manual review if needed

**Proposal Comparison (Google Gemini):**
- Compares all proposals for an RFP against original requirements
- Generates summary, individual scores, strengths/weaknesses per vendor
- Provides natural language recommendation with reasoning
- Temperature 0.5 for balanced accuracy and reasoning quality

### Email Handling Design

**SMTP (Sending):**
- Nodemailer configured with Gmail App Passwords for security
- Rich HTML formatting with CSS styling for professional appearance
- Plain text fallback for email clients that don't support HTML
- Tracks message IDs for delivery confirmation

**IMAP (Receiving):**
- Polling interval: 5 minutes (configurable via timeout)
- Only processes UNSEEN emails to avoid duplicates
- Matches incoming emails to RFPs by subject line parsing or explicit reference
- Creates proposals on successful parse; records errors in logs
- Supports multiple proposals from same vendor for same RFP (allows revised quotes)

**Email Format Assumptions:**
- Vendor responses contain structured information in email body
- Email subject includes RFP identifier (RFP ID or title reference)
- Plain text or HTML email bodies are preferred over rich formatting
- Attachments are parsed via mailparser's built-in handling

### System Limitations & Constraints

**Single-User System:**
- No authentication/authorization required
- No user role management
- Designed for sole procurement officer usage
- Email credentials stored in .env for single user

**Email Polling:**
- Asynchronous processing every 5 minutes
- Processing delays up to 5 minutes between vendor submission and system acknowledgment
- No real-time webhook integration

**AI Model Constraints:**
- Gemini API rate limits (verify quota for production use)
- No local LLM fallback if API is unavailable
- Parsing accuracy depends on email formatting consistency
- Unstructured or non-English emails may not parse correctly

**PDF/Attachment Handling:**
- Mailparser handles text extraction from PDFs
- Scanned PDFs (image-based) cannot be reliably extracted without OCR
- Excel/Word attachments have limited support
- Current implementation focuses on email body text

**Data Persistence:**
- PostgreSQL required for production
- SQLite not supported (though could be added)
- No backup/restore utilities included
- Manual database administration required for migrations

## AI Tools Usage in Development

This project was built using AI assistance throughout the development process, demonstrating the integration of AI as a development tool.

### AI Development Tools Used

1. **Cursor AI**
   - Role: Primary development assistant and code generation tool
   - Used for: Project initialization, React component scaffolding, Express route generation, Sequelize model setup, debugging and troubleshooting

2. **Google Gemini AI** 
   - Role: Integrated AI feature of the application itself (not just development)
   - Used for: RFP structure extraction, vendor response parsing, proposal comparison and recommendations

### AI-Assisted Development Process

#### 1. Project Architecture & Setup
- **Task**: Design initial project structure with separate frontend/backend
- **AI Assistance**: Generated folder structure, package.json dependencies, initial server setup
- **Approach**: Cursor provided template code for Express server and React app initialization
- **Learning**: Refined dependency versions to ensure compatibility

#### 2. Database Design & Models
- **Task**: Design data models for RFPs, Vendors, and Proposals
- **AI Assistance**: Generated Sequelize models with appropriate data types and relationships
- **Approach**: Started with simple models, iteratively added JSONB fields for flexible data storage
- **Learning**: Discovered that JSONB for requirements/specifications provides better flexibility than separate tables

#### 3. React Component Development
- **Task**: Build interactive UI components for dashboard, RFP creation, vendor management, proposal comparison
- **AI Assistance**: Generated component templates, form handling logic, and state management patterns
- **Approach**: Cursor created components with useState and useEffect hooks, then enhanced with custom styling
- **Learning**: Component-based architecture with clear separation of concerns (API layer in separate client.js)

#### 4. Express Routes & API Design
- **Task**: Create RESTful endpoints for RFPs, Vendors, Proposals
- **AI Assistance**: Generated route handlers with proper HTTP methods and status codes
- **Approach**: Used Cursor to scaffold routes, then added business logic and error handling
- **Learning**: Importance of consistent error response format for frontend reliability

#### 5. Email Integration
- **Task**: Implement SMTP (sending) and IMAP (receiving) email functionality
- **AI Assistance**: Cursor provided Nodemailer and imap library examples
- **Approach**: Used templates for SMTP configuration and IMAP polling loop
- **Learning**: Gmail requires App Passwords, not regular account password; polling interval considerations

#### 6. AI Integration Points
- **Task**: Integrate Google Gemini API for RFP creation, response parsing, and comparison
- **AI Assistance**: Cursor helped with prompt engineering and API integration patterns
- **Approach**: Started with basic prompts, iteratively improved to ensure JSON output quality
- **Relevant Prompts**:

  **RFP Creation Prompt:**
  ```
  "You are an AI assistant that converts natural language procurement requests into structured RFPs.
  Extract: title, description, budget, deadline, requirements array with item/quantity/specifications,
  paymentTerms, and warranty. Return ONLY valid JSON, no markdown or explanations."
  ```
  
  **Response Parsing Prompt:**
  ```
  "Extract structured proposal data from vendor email response. Return pricing breakdown, 
  totalPrice, deliveryTime, paymentTerms, warranty, additionalTerms, and completeness score (0-100).
  Response must be valid JSON only."
  ```
  
  **Comparison Prompt:**
  ```
  "Compare vendor proposals and provide summary, individual scores (0-100), recommendation with reasoning,
  and strengths/weaknesses per vendor. Return valid JSON only with no additional text."
  ```

- **Learning**: Importance of explicit JSON format enforcement; handling parse errors gracefully; lower temperature (0.3) for extraction, higher (0.5) for analysis

#### 7. Error Handling & Debugging
- **Task**: Add error handling throughout application for network, API, and validation errors
- **AI Assistance**: Cursor generated try-catch patterns and error middleware
- **Approach**: Added user-friendly error messages while maintaining server-side logging
- **Learning**: Balance between helpful user feedback and security (avoiding information disclosure)

### Key Changes & Learnings

1. **JSON Extraction Reliability**
   - Initial attempts returned markdown-formatted JSON with explanations
   - Solution: Added explicit "return ONLY valid JSON, no markdown" to prompts
   - Implemented extractAndParseJSON() function to handle edge cases and whitespace

2. **Email Polling Robustness**
   - Initial implementation crashed on parsing errors
   - Solution: Added try-catch blocks, error logging, and graceful fallback
   - Learned: Polling systems must be fault-tolerant to remain operational

3. **React State Management**
   - Initial approach used too many useState hooks
   - Solution: Consolidated related state, improved component organization
   - Learned: Clear component responsibilities improve maintainability

4. **API Response Consistency**
   - Initial routes had inconsistent error formats
   - Solution: Created error handling middleware for uniform responses
   - Learned: Frontend relies on consistent API contracts

5. **Temperature Settings for Prompts**
   - Initial attempts used default temperature for all tasks
   - Discovery: 0.3 temperature better for deterministic extraction, 0.5 better for analysis
   - Learned: Temperature settings significantly impact AI response quality

### Design Patterns & Best Practices Discovered

1. **Separation of Concerns**: Services (aiService, emailService) separate business logic from routes
2. **Error Boundaries**: Try-catch in routes, middleware error handling, user-facing error messages
3. **Async/Await**: Cleaner than callback-based code for sequential operations
4. **Environment Configuration**: .env.example shows required keys without exposing secrets
5. **Database Relationships**: Foreign keys and associations (hasMany, belongsTo) ensure data integrity

### What Would Be Different Without AI Assistance

- **Development Time**: Would take significantly longer to generate boilerplate and scaffold components
- **Code Quality**: Likely more inconsistent patterns; AI ensured consistent conventions
- **Feature Completeness**: More likely to focus on core features; AI suggestions enabled polish
- **Testing**: AI could have provided test cases (future improvement)
- **Documentation**: This detailed documentation was enhanced by AI clarification and organization

## Next Steps & Future Enhancements

### High Priority Improvements
- **Email Attachment Parsing**: Add PDF/Word document parsing for richer proposal data extraction
- **Real-Time Notifications**: Implement WebSocket support for real-time proposal updates
- **Proposal Scoring Algorithm**: Refine scoring to weight RFP requirements by importance
- **RFP Templates**: Create reusable RFP templates for common procurement types
- **Export Functionality**: Generate PDF reports of RFP details and comparison analysis

### Medium Priority Improvements
- **Authentication & Multi-User**: Add user authentication for team collaboration
- **Vendor Performance Tracking**: Track historical vendor performance across multiple RFPs
- **Automated Negotiation**: Suggest negotiation points based on proposal gaps
- **Integration with Procurement Platforms**: Connect to SAP Ariba, Coupa, or other platforms
- **Bulk RFP Processing**: Support creating multiple RFPs from CSV/Excel import

### Low Priority / Nice-to-Have
- **Mobile App**: React Native version for mobile proposal review
- **Advanced Analytics**: Dashboard with procurement metrics and insights
- **Custom Workflows**: Configurable approval workflows with multiple reviewers
- **Language Support**: Multi-language UI and email templates
- **Voice Interface**: Voice-controlled RFP creation and proposal review

## Known Issues & Limitations

### Current Known Issues
1. **Email Polling Delay**: Responses take up to 5 minutes to be processed (polling interval)
2. **Unstructured Responses**: Vendors who don't provide clear pricing/terms in email may not parse correctly
3. **Non-English Proposals**: AI parsing is optimized for English; other languages may have lower accuracy
4. **Rate Limiting**: Google Gemini API calls are subject to rate limits; high-volume usage may encounter throttling
5. **PDF Extraction**: Scanned PDFs cannot be parsed (would require OCR integration)

### Workarounds & Mitigations
- For urgent responses, manually parse using `/api/proposals/parse-email` endpoint
- Send vendors a proposal template/format for consistent responses
- Monitor API usage to stay within Google Gemini rate limits
- For PDF documents, use cloud OCR services (Google Vision API, Azure Computer Vision)

### Browser Compatibility
- **Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Not Supported**: Internet Explorer (unsupported browser)

## Deployment Guide

### Deployment to Production

#### Backend Deployment (Node.js Hosting)

**Option 1: Heroku**
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=3001 GEMINI_API_KEY=your_key DB_HOST=...

# Deploy
git push heroku main
```

**Option 2: AWS EC2 / DigitalOcean / Linode**
```bash
# Install Node.js and PostgreSQL on server
# Clone repository and install dependencies
npm install
npm run migrate

# Use PM2 for process management
pm2 start server.js --name "rfp-api"

# Configure nginx as reverse proxy
```

**Option 3: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

#### Frontend Deployment (React Hosting)

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
# Follow prompts to connect Git repo and deploy
```

**Option 2: Netlify**
```bash
npm run build
# Deploy the 'build' folder to Netlify
```

**Option 3: AWS S3 + CloudFront**
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name
# Create CloudFront distribution pointing to S3
```

#### Environment Configuration for Production
```env
# .env (Backend)
NODE_ENV=production
PORT=3001
DB_HOST=prod-database.example.com
DB_PORT=5432
DB_NAME=rfp_management
DB_USER=postgres
DB_PASSWORD=secure_password_here
GEMINI_API_KEY=your_production_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-password
FRONTEND_URL=https://your-frontend-domain.com
```

```env
# .env (Frontend)
REACT_APP_API_URL=https://your-backend-domain.com
```

### Security Considerations
- Use HTTPS/TLS for all endpoints
- Store secrets in environment variables, never commit to Git
- Use strong database passwords (minimum 16 characters)
- Enable database backups and point-in-time recovery
- Implement rate limiting on API endpoints
- Use CORS properly to allow only your frontend domain
- Consider adding request logging and monitoring
- Regularly update dependencies for security patches

## Support & Troubleshooting

### Common Issues

**Backend won't start**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
Solution: Ensure PostgreSQL is running and credentials in .env are correct
```

**Gmail SMTP errors**
```
Error: Invalid login credentials
Solution: Use App Password, not regular Gmail password. Enable 2FA first.
```

**CORS errors in browser**
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: Ensure backend is running and REACT_APP_API_URL is correct in .env
```

**Gemini API errors**
```
Error: Invalid API key
Solution: Verify API key from https://makersuite.google.com/app/apikey
```

### Getting Help

1. **Check logs**: Backend logs and browser console often contain detailed error messages
2. **Verify .env**: Ensure all required environment variables are set
3. **Test connectivity**: Verify backend is running with `curl http://localhost:3001/health`
4. **Database check**: Verify PostgreSQL and migrations are complete
5. **Email logs**: Check backend logs for email polling errors

## Contributing

This is a single-user assessment project. For modifications:
1. Create feature branches from `main`
2. Test thoroughly with the provided sample RFPs
3. Update README if adding new endpoints or features
4. Commit clean code with descriptive messages

## License

This project is provided as-is for the SDE Assessment program.

## Submission Checklist

Before submitting for evaluation:
- [ ] README is complete with all sections filled out
- [ ] .env.example files exist with no secrets exposed
- [ ] .gitignore properly excludes node_modules and .env
- [ ] No uncommitted changes or temporary files in repository
- [ ] Backend and frontend can start with `npm install && npm start`
- [ ] Database migrations run successfully
- [ ] All features working as described
- [ ] Demo video uploaded and link provided
- [ ] GitHub repository is public and accessible
