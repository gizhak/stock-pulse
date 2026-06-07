require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { StockScreener } = require('./src/screener');
const { TelegramService } = require('./src/services/telegram');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Stock Pulse Backend is running' });
});

app.get('/api/scan', async (req, res) => {
  try {
    const screener = new StockScreener();
    const results = await screener.scan();
    res.json(results);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const screener = new StockScreener();
    const stocks = await screener.getLatestScans();
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Stock Pulse Backend running on port ${PORT}`);

  if (process.env.AUTO_SCAN_ENABLED === 'true') {
    const screener = new StockScreener();
    const scanInterval = parseInt(process.env.SCAN_INTERVAL_MINUTES) || 60;
    console.log(`Auto-scan enabled every ${scanInterval} minutes`);

    setInterval(async () => {
      try {
        const results = await screener.scan();
        console.log(`Scan completed at ${new Date().toISOString()}`);
      } catch (error) {
        console.error('Auto-scan error:', error);
      }
    }, scanInterval * 60 * 1000);
  }
});
