class SignalGenerator {
  static generate(stockData, indicators) {
    const { price, volumeRatio } = stockData;
    const { rsi, ma50 } = indicators;

    let signal = 'HOLD';
    let confidence = 0;
    let reason = [];

    if (!rsi || !ma50) {
      return { signal: 'INSUFFICIENT_DATA', confidence: 0, reason: ['Not enough historical data'] };
    }

    // BUY signals
    const priceAboveMA50 = price > ma50;
    const rsiInBuyZone = rsi >= 45 && rsi <= 65;
    const volumeStrong = volumeRatio >= 120;

    if (priceAboveMA50 && rsiInBuyZone && volumeStrong) {
      signal = 'BUY';
      confidence = 95;
      reason = [
        `RSI at ${rsi.toFixed(2)} (optimal buy zone 45-65)`,
        `Price $${price.toFixed(2)} above MA50 $${ma50.toFixed(2)}`,
        `Volume ${volumeRatio.toFixed(1)}% of average`,
      ];
    }
    // SELL signals
    else if (rsi < 35 || price < ma50) {
      signal = 'SELL';
      confidence = 90;
      reason = [];
      if (rsi < 35) {
        reason.push(`RSI at ${rsi.toFixed(2)} (oversold zone < 35)`);
      }
      if (price < ma50) {
        reason.push(`Price $${price.toFixed(2)} below MA50 $${ma50.toFixed(2)}`);
      }
    }
    // HOLD
    else {
      signal = 'HOLD';
      confidence = 60;
      reason = ['Indicators suggest holding current position'];
    }

    return { signal, confidence, reason };
  }
}

module.exports = { SignalGenerator };
