const { BaseDataProvider } = require('./BaseDataProvider');

class YahooFinanceProvider extends BaseDataProvider {
  constructor() {
    super();
    this.yahooFinance = null;
  }

  async getYahooFinance() {
    if (!this.yahooFinance) {
      try {
        const module = await import('yahoo-finance2');
        this.yahooFinance = module.default || module;
      } catch (error) {
        console.error('Failed to import yahoo-finance2:', error.message);
        throw new Error('Yahoo Finance module not available');
      }
    }
    return this.yahooFinance;
  }

  async fetchStockData(symbol) {
    try {
      const yf = await this.getYahooFinance();

      if (typeof yf.quote !== 'function') {
        throw new Error('yf.quote is not available - trying alternative method');
      }

      const quote = await yf.quote(symbol);
      return {
        symbol: quote.symbol,
        price: quote.regularMarketPrice,
        volume: quote.regularMarketVolume,
        previousClose: quote.regularMarketPreviousClose,
        open: quote.regularMarketOpen,
        high: quote.regularMarketDayHigh,
        low: quote.regularMarketDayLow,
        averageVolume: quote.averageVolume,
        marketCap: quote.marketCap,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch data for ${symbol}: ${error.message}`);
    }
  }

  async fetchHistoricalData(symbol, interval = '1d', period = '2mo') {
    try {
      const yf = await this.getYahooFinance();

      if (typeof yf.historical !== 'function') {
        throw new Error('yf.historical is not available');
      }

      const result = await yf.historical(symbol, {
        period,
        interval,
      });
      return result.map(bar => ({
        date: bar.date,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
        volume: bar.volume,
        adjClose: bar.adjClose,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch historical data for ${symbol}: ${error.message}`);
    }
  }
}

module.exports = { YahooFinanceProvider };
