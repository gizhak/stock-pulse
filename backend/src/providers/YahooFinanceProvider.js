const yahooFinance = require('yahoo-finance2').default;
const { BaseDataProvider } = require('./BaseDataProvider');

class YahooFinanceProvider extends BaseDataProvider {
  async fetchStockData(symbol) {
    try {
      const quote = await yahooFinance.quote(symbol);
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
      const result = await yahooFinance.historical(symbol, {
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
