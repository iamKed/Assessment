# Quick Setup Guide

## Prerequisites Installation

### 1. Install Node.js and npm
```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Verify installation
node --version  # Should be 18+
npm --version
```

### 2. Install PostgreSQL
```bash
# On Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb rfp_management
```

### 3. Get Google Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign up or log in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the generated API key (you'll need it for the .env file)

### 4. Email Setup (Gmail Example)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the generated password

## Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp env.example .env

# Edit .env with your credentials:
# - Database credentials
# - Google Gemini API key
# - Email credentials (SMTP and IMAP)

# Run database migrations
npm run migrate

# Start backend server
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp env.example .env

# Edit .env if needed (default should work if backend is on localhost:3001)

# Start frontend
npm start
```

## Testing the Setup

1. Open http://localhost:3000 in your browser
2. Create a vendor in the Vendors section
3. Create an RFP using natural language
4. Send the RFP to vendors
5. Check email polling is working (check backend logs)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check database credentials in `.env`
- Verify database exists: `sudo -u postgres psql -l`

### Email Issues
- For Gmail, ensure you're using App Password, not regular password
- Check SMTP/IMAP settings match your email provider
- Some email providers require enabling "Less secure app access" (not recommended, use App Passwords)

### Google Gemini API Issues
- Verify API key is correct
- Check you have access to Google AI Studio / Gemini API
- Ensure API key has proper permissions
