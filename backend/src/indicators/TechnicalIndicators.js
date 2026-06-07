class TechnicalIndicators {
  static calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) {
      return null;
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    let rsi = 100 - (100 / (1 + rs));

    // Continue with smoothing for remaining prices
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? Math.abs(change) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
    }

    return Math.round(rsi * 100) / 100;
  }

  static calculateMovingAverage(prices, period = 50) {
    if (prices.length < period) {
      return null;
    }

    const slice = prices.slice(-period);
    const sum = slice.reduce((acc, price) => acc + price, 0);
    return Math.round((sum / period) * 100) / 100;
  }

  static calculateVolumeRatio(currentVolume, avgVolume) {
    if (avgVolume === 0) return 0;
    return Math.round((currentVolume / avgVolume) * 10000) / 100;
  }
}

module.exports = { TechnicalIndicators };
