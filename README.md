# 📊 Stock Pulse - AI-Powered Stock Screener

A sophisticated stock screener bot that analyzes real-time market data, calculates technical indicators, and generates AI-powered trading signals in Hebrew via Telegram alerts.

## Features

✨ **Core Features:**
- **Real-time Stock Data**: Fetches 20 popular US stocks from Yahoo Finance
- **Technical Analysis**: Calculates RSI, 50-day moving average, and volume ratios
- **Smart Trading Signals**: BUY/SELL/HOLD based on technical indicators
- **AI Analysis**: Uses Claude API to generate Hebrew explanations for each signal
- **Telegram Alerts**: Sends instant notifications for BUY/SELL signals
- **MongoDB Integration**: Stores scan history and analysis results
- **Modern Dashboard**: Clean React frontend with real-time data visualization

📈 **Stocks Monitored:**
AAPL, NVDA, MSFT, TSLA, AMZN, GOOGL, META, AMD, NFLX, DIS, PYPL, INTC, CRM, UBER, SHOP, SQ, ROKU, SNAP, COIN, PLTR

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB Atlas (free tier)
- Yahoo Finance API (free via npm package)
- Anthropic Claude API (AI analysis)
- Telegram Bot API

**Frontend:**
- React 18
- CSS3 (modern styling with gradients)
- Axios for HTTP requests

**Architecture:**
- Modular data provider abstraction (easy to swap providers)
- Dependency injection pattern
- Separation of concerns

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier)
- Anthropic API key (https://console.anthropic.com)
- Telegram Bot (optional, for alerts)

### 1. Clone & Install

```bash
# Clone the repository
git clone <repo-url>
cd stock-pulse

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

cd ..
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual keys
nano .env
```

**Required Environment Variables:**

```env
# Backend
PORT=3000
NODE_ENV=development

# MongoDB Atlas (free tier signup at https://www.mongodb.com/cloud/atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-pulse?retryWrites=true&w=majority

# Anthropic Claude API (get key at https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# Telegram (optional)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789

# Auto-scan (set to true to enable automatic scans)
AUTO_SCAN_ENABLED=false
SCAN_INTERVAL_MINUTES=60
```

### 3. Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Create a database user with password
5. Whitelist your IP (or use 0.0.0.0 for any IP)
6. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/stock-pulse`
7. Add to `.env` file

### 4. Setup Anthropic API

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Create an API key
4. Add to `.env` file as `ANTHROPIC_API_KEY`

### 5. Setup Telegram Bot (Optional)

1. Chat with @BotFather on Telegram
2. Create a new bot: `/newbot`
3. Copy your bot token
4. Get your chat ID:
   - Send a message to your bot
   - Go to: `https://api.telegram.org/botYOUR_TOKEN/getUpdates`
   - Find your chat ID in the response
5. Add to `.env` file

### 6. Run the Application

**Backend:**
```bash
cd backend
npm start
# Or with auto-reload in dev:
npm run dev
```

Backend runs on: `http://localhost:3000`

**Frontend (in a new terminal):**
```bash
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000` (React's default)

### 7. Test the Application

1. Open frontend at `http://localhost:3000`
2. Click "Run Scan" button to manually trigger analysis
3. Wait for results to populate
4. Click on a stock symbol to see:
   - Detailed indicators (RSI, MA50, Volume)
   - AI-generated Hebrew explanation
   - Signal reasoning
5. If Telegram is configured, you'll receive alerts for BUY/SELL signals

## API Endpoints

### Backend Routes

**GET `/api/health`**
- Check if backend is running
- Response: `{ status: "Stock Pulse Backend is running" }`

**GET `/api/scan`**
- Trigger manual stock scan
- Response: Scan results with BUY/SELL/HOLD signals

**GET `/api/stocks`**
- Get latest scan results from MongoDB
- Response: Array of stocks with indicators and signals

## Project Structure

```
stock-pulse/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── package.json
│   └── src/
│       ├── screener.js           # Main screening orchestrator
│       ├── providers/
│       │   ├── BaseDataProvider.js    # Abstract base class
│       │   └── YahooFinanceProvider.js # Yahoo Finance implementation
│       ├── indicators/
│       │   └── TechnicalIndicators.js # RSI, MA50 calculations
│       ├── signals/
│       │   └── SignalGenerator.js     # BUY/SELL/HOLD logic
│       ├── services/
│       │   ├── claude.js         # Claude API integration
│       │   └── telegram.js       # Telegram alerts
│       └── models/
│           └── StockScan.js      # MongoDB schema
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js                # Main app component
│       ├── App.css
│       ├── index.js
│       ├── index.css
│       └── components/
│           ├── SummaryCards.js   # Dashboard cards
│           ├── StockTable.js     # Main table
│           ├── StockRow.js       # Expandable row
│           └── LoadingSpinner.js
│
├── .env.example                  # Environment variables template
└── README.md                      # This file
```

## Trading Signal Logic

### BUY Signal 🟢
Triggers when ALL of the following are true:
- **RSI**: 45-65 (neither overbought nor oversold)
- **Price**: Above 50-day moving average (uptrend)
- **Volume**: ≥ 120% of average volume (strong demand)

### SELL Signal 🔴
Triggers when ANY of the following is true:
- **RSI**: < 35 (oversold, potential reversal down)
- **Price**: Below 50-day moving average (downtrend)

### HOLD Signal 🟡
All other cases - maintain current position

## Customization

### Add More Stocks
Edit `backend/src/screener.js`:
```javascript
const WATCH_LIST = [
  'AAPL', 'NVDA', 'MSFT', // ... add your symbols
];
```

### Adjust Technical Indicators
`backend/src/signals/SignalGenerator.js`:
```javascript
// Change RSI thresholds, MA period, volume ratio, etc.
```

### Use Different Data Provider
Create a new provider in `backend/src/providers/`:
1. Extend `BaseDataProvider`
2. Implement `fetchStockData()` and `fetchHistoricalData()`
3. Update `screener.js` to use it

Example:
```javascript
// MyCustomProvider.js
class MyCustomProvider extends BaseDataProvider {
  async fetchStockData(symbol) {
    // Your implementation
  }
}
```

## Troubleshooting

### Backend Connection Issues
```
Error: MongoDB connection failed
→ Check MONGODB_URI in .env
→ Verify IP whitelist in MongoDB Atlas
→ Check username/password
```

### Claude API Errors
```
Error: ANTHROPIC_API_KEY not found
→ Check your .env file
→ Verify API key at https://console.anthropic.com
→ Ensure key has correct format (sk-ant-...)
```

### Telegram Not Sending
```
Error: Telegram bot token invalid
→ Verify token from @BotFather
→ Check TELEGRAM_CHAT_ID is a number
→ Ensure bot has message permissions
```

### Frontend Can't Connect to Backend
```
Error: API request failed
→ Ensure backend is running: npm start
→ Check REACT_APP_API_URL in frontend/.env
→ Verify backend is on correct port (default 3000)
```

## Performance Notes

- Initial scan takes ~30-60 seconds (fetches data for 20 stocks)
- Each stock needs ~3 months of historical data for RSI calculation
- Recommend scans every 60+ minutes (market data updates)
- MongoDB Atlas free tier supports millions of documents

## Future Enhancements

- [ ] Support for additional stocks beyond top 20
- [ ] More technical indicators (MACD, Bollinger Bands, etc.)
- [ ] Price alerts (email, SMS)
- [ ] Portfolio tracking
- [ ] Backtesting historical signals
- [ ] WebSocket for real-time updates
- [ ] Admin dashboard
- [ ] Multi-language support

## License

MIT

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review logs in terminal
3. Verify all environment variables are set
4. Check API service status (Anthropic, Yahoo Finance, MongoDB)

---

**Built with ❤️ for stock traders**