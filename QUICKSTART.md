# Stock Pulse - Quick Start Guide

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 16+ and npm installed
- Free API keys from:
  - Anthropic (for Claude AI): https://console.anthropic.com
  - MongoDB Atlas (for database): https://www.mongodb.com/cloud/atlas

## Step 1: Initial Setup (1 minute)

```bash
# Make setup script executable (if not already)
chmod +x setup.sh

# Run the setup script
./setup.sh
```

This will:
- Create `.env` and `frontend/.env` files from templates
- Install all dependencies for backend and frontend

## Step 2: Configure API Keys (2 minutes)

Edit the `.env` file in the root directory:

```bash
nano .env
```

Fill in these required keys:

**Anthropic API Key** (for Hebrew analysis):
1. Go to https://console.anthropic.com
2. Create a new API key
3. Copy and paste it as `ANTHROPIC_API_KEY=sk-ant-...`

**MongoDB Connection String** (for storing results):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create an M0 cluster
4. Get connection string
5. Paste it as `MONGODB_URI=mongodb+srv://...`

**Telegram Bot** (optional, for alerts):
1. Chat with @BotFather on Telegram
2. Send `/newbot` and follow instructions
3. Copy bot token and add as `TELEGRAM_BOT_TOKEN=123456:ABC...`

## Step 3: Start the Backend (1 minute)

In Terminal 1:
```bash
cd backend
npm start
```

You should see:
```
Stock Pulse Backend running on port 3000
```

## Step 4: Start the Frontend (1 minute)

In Terminal 2:
```bash
cd frontend
npm start
```

This will automatically open http://localhost:3000 in your browser.

## Step 5: Run Your First Scan!

1. Click the **"Run Scan"** button in the dashboard
2. Wait 30-60 seconds for analysis to complete
3. See stocks with BUY/SELL/HOLD signals
4. Click on a stock to see:
   - Technical indicators (RSI, MA50, Volume)
   - Hebrew AI explanation
   - Trading reasoning

## What's Happening Behind the Scenes

1. **Backend** fetches real-time data from Yahoo Finance for 20 stocks
2. **Calculates** technical indicators (RSI, 50-day MA, volume)
3. **Generates** trading signals (BUY when conditions are favorable, SELL when oversold, HOLD otherwise)
4. **Uses Claude API** to explain the signals in Hebrew
5. **Stores** results in MongoDB for history
6. **Sends Telegram alerts** (if configured) for BUY/SELL signals
7. **Frontend** displays results in a clean, interactive dashboard

## Troubleshooting

### Backend won't start
```
Error: Cannot find module 'yahoo-finance2'
→ Run: cd backend && npm install
```

### Frontend won't load
```
Error: Failed to connect to API
→ Make sure backend is running on http://localhost:3000
→ Check if PORT=3000 in backend/.env
```

### Claude API errors
```
Error: ANTHROPIC_API_KEY is invalid
→ Verify your API key format (starts with sk-ant-)
→ Check it's valid at https://console.anthropic.com
```

### MongoDB connection failed
```
Error: MongoDB connection timeout
→ Check MONGODB_URI format in .env
→ Verify IP whitelist in MongoDB Atlas (add 0.0.0.0)
→ Check username and password
```

## Next Steps

- **Customize stocks**: Edit `backend/src/screener.js` to add/remove stocks
- **Adjust signals**: Change thresholds in `backend/src/signals/SignalGenerator.js`
- **Swap data provider**: Implement a new provider class (see README.md)
- **Deploy to production**: See deployment guides in documentation

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/screener.js` | Main orchestrator |
| `backend/src/signals/SignalGenerator.js` | Signal logic (BUY/SELL/HOLD) |
| `backend/src/services/claude.js` | AI explanations |
| `frontend/src/App.js` | Dashboard |

## Monitoring

**Check backend logs:**
```bash
cd backend && npm run dev  # Shows detailed logs with nodemon
```

**Check frontend console:**
- Open browser DevTools (F12)
- Look in the Console tab for any errors

**Monitor database:**
- Go to https://www.mongodb.com/cloud/atlas
- Your database is stored as "stock-pulse"
- Collections: `stocks`

---

**Need help?** See the full README.md for detailed setup and customization options.
