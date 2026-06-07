// Test script to verify technical indicators calculations
const { TechnicalIndicators } = require('./src/indicators/TechnicalIndicators');
const { SignalGenerator } = require('./src/signals/SignalGenerator');

console.log('📊 Stock Pulse - Technical Indicators Test\n');

// Sample price data (60 days)
const samplePrices = [
  150, 151, 152, 151, 150, 151, 152, 153, 152, 151,
  150, 151, 150, 149, 148, 147, 148, 149, 150, 151,
  152, 153, 154, 155, 156, 155, 154, 153, 152, 151,
  150, 149, 150, 151, 152, 153, 154, 155, 156, 157,
  158, 159, 160, 159, 158, 157, 156, 155, 154, 153,
  152, 151, 150, 149, 148, 147, 148, 149, 150, 151
];

console.log('📈 Test Data:');
console.log(`   Price range: $${Math.min(...samplePrices)} - $${Math.max(...samplePrices)}`);
console.log(`   Data points: ${samplePrices.length}\n`);

// Test RSI calculation
console.log('🎯 Testing RSI (14 periods):');
const rsi = TechnicalIndicators.calculateRSI(samplePrices, 14);
console.log(`   RSI: ${rsi}`);
console.log(`   Status: ${rsi > 70 ? 'Overbought ⚠️' : rsi < 30 ? 'Oversold ⚠️' : 'Normal ✓'}\n`);

// Test Moving Average
console.log('📊 Testing Moving Average (50 periods):');
const ma50 = TechnicalIndicators.calculateMovingAverage(samplePrices, 50);
console.log(`   MA50: $${ma50}`);
console.log(`   Current Price: $${samplePrices[samplePrices.length - 1]}`);
const pricePosition = samplePrices[samplePrices.length - 1] > ma50 ? 'Above ✓' : 'Below ⚠️';
console.log(`   Price vs MA50: ${pricePosition}\n`);

// Test Volume Ratio
console.log('📊 Testing Volume Ratio:');
const currentVolume = 1500000;
const avgVolume = 1200000;
const volumeRatio = TechnicalIndicators.calculateVolumeRatio(currentVolume, avgVolume);
console.log(`   Current Volume: ${currentVolume.toLocaleString()}`);
console.log(`   Avg Volume: ${avgVolume.toLocaleString()}`);
console.log(`   Ratio: ${volumeRatio}%`);
console.log(`   Status: ${volumeRatio >= 120 ? 'Strong ✓' : 'Weak ⚠️'}\n`);

// Test Signal Generation
console.log('🚀 Testing Signal Generation:\n');

const testCases = [
  {
    name: 'BUY Signal Case',
    price: 160,
    rsi: 55,
    ma50: 150,
    volume: 1500000,
    avgVolume: 1000000
  },
  {
    name: 'SELL Signal Case (Oversold)',
    price: 145,
    rsi: 25,
    ma50: 150,
    volume: 900000,
    avgVolume: 1000000
  },
  {
    name: 'SELL Signal Case (Below MA)',
    price: 145,
    rsi: 50,
    ma50: 150,
    volume: 900000,
    avgVolume: 1000000
  },
  {
    name: 'HOLD Signal Case',
    price: 155,
    rsi: 50,
    ma50: 150,
    volume: 800000,
    avgVolume: 1000000
  }
];

testCases.forEach(testCase => {
  console.log(`Case: ${testCase.name}`);

  const stockData = {
    price: testCase.price,
    volumeRatio: TechnicalIndicators.calculateVolumeRatio(
      testCase.volume,
      testCase.avgVolume
    )
  };

  const indicators = {
    rsi: testCase.rsi,
    ma50: testCase.ma50
  };

  const signal = SignalGenerator.generate(stockData, indicators);

  console.log(`  Price: $${testCase.price} | RSI: ${testCase.rsi} | MA50: $${testCase.ma50}`);
  console.log(`  Volume Ratio: ${stockData.volumeRatio.toFixed(1)}%`);
  console.log(`  Signal: ${signal.signal}`);
  console.log(`  Confidence: ${signal.confidence}%`);
  console.log(`  Reasons:`);
  signal.reason.forEach(r => console.log(`    - ${r}`));
  console.log();
});

console.log('✅ Technical Indicators Test Complete');
