const { BaseDataProvider } = require('./BaseDataProvider');

class MockDataProvider extends BaseDataProvider {
  constructor() {
    super();
    this.mockData = {
      AAPL: { price: 192.53, volume: 45000000, avg: 38000000 },
      NVDA: { price: 875.20, volume: 22000000, avg: 18000000 },
      MSFT: { price: 421.85, volume: 18000000, avg: 16000000 },
      TSLA: { price: 248.40, volume: 120000000, avg: 100000000 },
      AMZN: { price: 193.20, volume: 48000000, avg: 42000000 },
      GOOGL: { price: 178.50, volume: 18000000, avg: 16000000 },
      META: { price: 465.75, volume: 12000000, avg: 11000000 },
      AMD: { price: 202.10, volume: 45000000, avg: 40000000 },
      NFLX: { price: 245.30, volume: 2800000, avg: 2500000 },
      DIS: { price: 96.80, volume: 8000000, avg: 7000000 },
      PYPL: { price: 75.40, volume: 10000000, avg: 9000000 },
      INTC: { price: 38.95, volume: 38000000, avg: 35000000 },
      CRM: { price: 245.20, volume: 3000000, avg: 2800000 },
      UBER: { price: 78.50, volume: 20000000, avg: 18000000 },
      SHOP: { price: 85.30, volume: 18000000, avg: 16000000 },
      SQ: { price: 198.75, volume: 8000000, avg: 7500000 },
      ROKU: { price: 45.20, volume: 4000000, avg: 3500000 },
      SNAP: { price: 18.40, volume: 50000000, avg: 45000000 },
      COIN: { price: 178.50, volume: 12000000, avg: 10000000 },
      PLTR: { price: 27.85, volume: 80000000, avg: 70000000 },
    };
  }

  async fetchStockData(symbol) {
    const data = this.mockData[symbol];
    if (!data) {
      throw new Error(`No data for ${symbol}`);
    }

    return {
      symbol,
      price: data.price + (Math.random() - 0.5) * 5,
      volume: data.volume + Math.floor(Math.random() * 10000000),
      previousClose: data.price * 0.98,
      open: data.price * 0.99,
      high: data.price * 1.02,
      low: data.price * 0.97,
      averageVolume: data.avg,
      marketCap: data.price * 1000000000,
      timestamp: new Date(),
    };
  }

  async fetchHistoricalData(symbol, interval = '1d', period = '2mo') {
    const basePrice = this.mockData[symbol]?.price || 100;
    const days = 60;
    const result = [];

    for (let i = days; i > 0; i--) {
      const variation = (Math.random() - 0.5) * 0.04;
      const price = basePrice * (1 + variation * (days - i) / days);

      result.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        open: price * 0.99,
        high: price * 1.01,
        low: price * 0.98,
        close: price,
        volume: Math.floor(Math.random() * 50000000) + 10000000,
        adjClose: price,
      });
    }

    return result;
  }
}

module.exports = { MockDataProvider };
