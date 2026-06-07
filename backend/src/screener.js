const { MockDataProvider } = require('./providers/MockDataProvider');
// const { YahooFinanceProvider } = require('./providers/YahooFinanceProvider');
const { TechnicalIndicators } = require('./indicators/TechnicalIndicators');
const { SignalGenerator } = require('./signals/SignalGenerator');
const { TelegramService } = require('./services/telegram');
const { Stock } = require('./models/StockScan');

const WATCH_LIST = [
  'AAPL', 'NVDA', 'MSFT', 'TSLA', 'AMZN',
  'GOOGL', 'META', 'AMD', 'NFLX', 'DIS',
  'PYPL', 'INTC', 'CRM', 'UBER', 'SHOP',
  'SQ', 'ROKU', 'SNAP', 'COIN', 'PLTR',
];

class StockScreener {
  constructor() {
    // Using MockDataProvider temporarily (Yahoo Finance has ESM issues)
    // Switch back to YahooFinanceProvider once fixed
    this.dataProvider = new MockDataProvider();
    this.telegramService = new TelegramService();
    this.latestResults = null;
  }

  generateExplanation(symbol, signal, indicators, stockData) {
    const signalEmoji = signal.signal === 'BUY' ? '🟢' : signal.signal === 'SELL' ? '🔴' : '🟡';

    let explanation = `${signalEmoji} ${symbol}: סימן ${signal.signal}\n\n`;
    explanation += `📊 אינדיקטורים:\n`;
    explanation += `• RSI: ${indicators.rsi?.toFixed(2)} ${indicators.rsi > 70 ? '(קנוי יתר)' : indicators.rsi < 30 ? '(נמכר יתר)' : '(נורמלי)'}\n`;
    explanation += `• MA50: $${indicators.ma50?.toFixed(2)}\n`;
    explanation += `• מחיר נוכחי: $${stockData.price?.toFixed(2)}\n`;
    explanation += `• היקף: ${stockData.volumeRatio?.toFixed(1)}% מממוצע\n\n`;
    explanation += `🎯 סיבות:\n`;
    signal.reason.forEach(r => {
      explanation += `• ${r}\n`;
    });
    explanation += `\n📡 מקור נתונים: Yahoo Finance`;

    return explanation;
  }

  async scan() {
    console.log(`Starting stock scan at ${new Date().toISOString()}`);
    const results = {
      timestamp: new Date(),
      scannedCount: 0,
      buySignals: [],
      sellSignals: [],
      holdSignals: [],
      errors: [],
    };

    for (const symbol of WATCH_LIST) {
      try {
        const stockResult = await this.analyzeStock(symbol);
        if (stockResult) {
          results.scannedCount++;
          if (stockResult.signal.signal === 'BUY') {
            results.buySignals.push(stockResult);
          } else if (stockResult.signal.signal === 'SELL') {
            results.sellSignals.push(stockResult);
          } else if (stockResult.signal.signal === 'HOLD') {
            results.holdSignals.push(stockResult);
          }

          // Send Telegram alert for BUY/SELL signals
          if (stockResult.signal.signal === 'BUY' || stockResult.signal.signal === 'SELL') {
            await this.telegramService.sendSignalAlert(stockResult);
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${symbol}:`, error.message);
        results.errors.push({ symbol, error: error.message });
      }
    }

    // Save to Memory (for display)
    const allStocks = [
      ...results.buySignals,
      ...results.sellSignals,
      ...results.holdSignals,
    ];
    this.latestResults = allStocks;

    // Save to MongoDB (if available)
    if (process.env.MONGODB_URI) {
      await this.saveResults(results);
    }

    return results;
  }

  async analyzeStock(symbol) {
    const currentData = await this.dataProvider.fetchStockData(symbol);
    const historicalData = await this.dataProvider.fetchHistoricalData(symbol, '1d', '3mo');

    const prices = historicalData.map(bar => bar.close);
    const volumes = historicalData.map(bar => bar.volume);

    const rsi = TechnicalIndicators.calculateRSI(prices);
    const ma50 = TechnicalIndicators.calculateMovingAverage(prices, 50);
    const volumeRatio = TechnicalIndicators.calculateVolumeRatio(
      currentData.volume,
      currentData.averageVolume
    );

    const indicators = { rsi, ma50, volumeRatio };
    const stockData = { ...currentData, volumeRatio };

    const signal = SignalGenerator.generate(stockData, indicators);

    // Generate Hebrew explanation (no Claude API needed)
    const explanation = this.generateExplanation(symbol, signal, indicators, stockData);

    return {
      symbol,
      latestData: currentData,
      latestIndicators: { rsi, ma50 },
      signal: {
        ...signal,
        explanation,
      },
    };
  }

  async saveResults(results) {
    try {
      for (const signal of [
        ...results.buySignals,
        ...results.sellSignals,
        ...results.holdSignals,
      ]) {
        const { symbol, latestData, latestIndicators, signal: signalData } = signal;

        await Stock.findOneAndUpdate(
          { symbol },
          {
            $set: {
              latestData,
              latestIndicators,
              latestSignal: signalData,
            },
            $push: {
              signals: signalData,
              indicators: latestIndicators,
            },
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
    }
  }

  async getLatestScans() {
    // Return latest results from memory first
    if (this.latestResults && this.latestResults.length > 0) {
      return this.latestResults;
    }

    // Fall back to MongoDB if available
    if (process.env.MONGODB_URI) {
      try {
        return await Stock.find().sort({ updatedAt: -1 });
      } catch (error) {
        console.error('Error fetching from MongoDB:', error);
        return [];
      }
    }

    return [];
  }
}

module.exports = { StockScreener };
