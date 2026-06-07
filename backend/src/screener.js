const { YahooFinanceProvider } = require('./providers/YahooFinanceProvider');
const { TechnicalIndicators } = require('./indicators/TechnicalIndicators');
const { SignalGenerator } = require('./signals/SignalGenerator');
const { ClaudeService } = require('./services/claude');
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
    this.dataProvider = new YahooFinanceProvider();
    this.claudeService = new ClaudeService();
    this.telegramService = new TelegramService();
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

    // Save to MongoDB
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

    // Get Hebrew explanation from Claude
    const explanation = await this.claudeService.generateSignalExplanation(
      symbol,
      signal,
      indicators,
      stockData
    );

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
    if (!process.env.MONGODB_URI) {
      return [];
    }

    try {
      return await Stock.find().sort({ updatedAt: -1 });
    } catch (error) {
      console.error('Error fetching from MongoDB:', error);
      return [];
    }
  }
}

module.exports = { StockScreener };
