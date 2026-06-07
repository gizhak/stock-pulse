# Stock Pulse - Quick Start Guide

Get up and running in 3 minutes! 🚀

## ⭐ Good News: Runs 100% FREE!

Stock Pulse works **completely free** with:
- ✅ Yahoo Finance (free data)
- ✅ No API keys required
- ✅ Hebrew explanations (auto-generated)
- 🎁 Optional: Add MongoDB for history, Telegram for alerts

## Prerequisites

- Node.js 16+ and npm installed
- That's it! No paid APIs needed 🎉

## Step 1: Initial Setup (1 minute)

```bash
# In your terminal
bash setup.sh
```

This will:
- Create `.env` file from template
- Install all dependencies for backend and frontend

## Step 2: Configure (Optional - 1 minute)

The `.env` file comes pre-configured for FREE operation.

**Optional upgrades:**

If you want alerts via Telegram:
1. Chat with @BotFather on Telegram
2. Create a bot: `/newbot`
3. Copy bot token into `.env`:
   ```
   TELEGRAM_BOT_TOKEN=123456:ABC...
   TELEGRAM_CHAT_ID=your-id
   ```

If you want to save history to database:
1. Sign up at https://www.mongodb.com/cloud/atlas (free tier)
2. Create M0 cluster
3. Get connection string and add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://...
   ```

## Step 3: Start the Backend

Terminal 1:
```bash
cd backend
npm start
```

Expected output:
```
Stock Pulse Backend running on port 3000
```

## Step 4: Start the Frontend

Terminal 2:
```bash
cd frontend
npm start
```

Your browser opens automatically to http://localhost:3000

## Step 5: Run Your First Scan! 🚀

1. Click **"Run Scan"** button
2. Wait 30-60 seconds (first scan takes longer)
3. Watch results populate with BUY/SELL/HOLD signals 🟢🔴🟡
4. Click on any stock to see:
   - Technical indicators (RSI, MA50, Volume)
   - Hebrew explanation of the signal
   - Why this signal was generated

## What Happens Behind the Scenes

1. **Fetches** real-time data from Yahoo Finance (20 stocks)
2. **Calculates** technical indicators:
   - RSI (14 periods) - momentum indicator
   - MA50 - trend direction
   - Volume ratio - trading strength
3. **Generates** trading signals:
   - 🟢 **BUY**: Good conditions (RSI 45-65 + price above MA50 + high volume)
   - 🔴 **SELL**: Warning (RSI oversold OR price below MA50)
   - 🟡 **HOLD**: Everything else
4. **Creates** Hebrew explanation from the data
5. **Sends Telegram alert** (if configured) for BUY/SELL signals
6. **Saves** results to MongoDB (if configured)

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
→ Make sure backend is running on port 3000
→ Check your .env file
```

### Scan gives errors
```
Error: Failed to fetch data for AAPL
→ Yahoo Finance might be temporarily down
→ Try again in a few minutes
```

### Telegram alerts not working
```
Error: Telegram bot token invalid
→ Leave blank for now (alerts are optional)
→ Add TELEGRAM_BOT_TOKEN later if you want alerts
```

### MongoDB not saving
```
Error: MongoDB connection timeout
→ Leave MONGODB_URI blank (optional)
→ Data still displays in dashboard even without database
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
