class BaseDataProvider {
  async fetchStockData(symbol) {
    throw new Error('fetchStockData must be implemented');
  }

  async fetchHistoricalData(symbol, startDate, endDate) {
    throw new Error('fetchHistoricalData must be implemented');
  }

  async fetchBatch(symbols) {
    const results = {};
    for (const symbol of symbols) {
      try {
        results[symbol] = await this.fetchStockData(symbol);
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        results[symbol] = null;
      }
    }
    return results;
  }
}

module.exports = { BaseDataProvider };
