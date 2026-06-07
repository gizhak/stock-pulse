const mongoose = require('mongoose');

const SignalSchema = new mongoose.Schema({
  signal: {
    type: String,
    enum: ['BUY', 'SELL', 'HOLD', 'INSUFFICIENT_DATA'],
    required: true,
  },
  confidence: Number,
  reason: [String],
  explanation: String,
  timestamp: { type: Date, default: Date.now },
});

const IndicatorsSchema = new mongoose.Schema({
  rsi: Number,
  ma50: Number,
  volumeRatio: Number,
  timestamp: { type: Date, default: Date.now },
});

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  latestData: {
    price: Number,
    volume: Number,
    previousClose: Number,
    open: Number,
    high: Number,
    low: Number,
    averageVolume: Number,
    marketCap: Number,
    timestamp: Date,
  },
  latestIndicators: IndicatorsSchema,
  latestSignal: SignalSchema,
  signals: [SignalSchema],
  indicators: [IndicatorsSchema],
  scanHistory: [{
    timestamp: Date,
    data: mongoose.Schema.Types.Mixed,
    indicators: mongoose.Schema.Types.Mixed,
    signal: mongoose.Schema.Types.Mixed,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

StockSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = { Stock };
