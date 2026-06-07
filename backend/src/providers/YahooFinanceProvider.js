const { BaseDataProvider } = require('./BaseDataProvider');

class YahooFinanceProvider extends BaseDataProvider {
  constructor() {
    super();
    this.yahooFinance = null;
  }

  async getYahooFinance() {
    if (!this.yahooFinance) {
      this.yahooFinance = (await import('yahoo-finance2')).default;
    }
    return this.yahooFinance;
  }

  async fetchStockData(symbol) {
    try {
      const yf = await this.getYahooFinance();
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
