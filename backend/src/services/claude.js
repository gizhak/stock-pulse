const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateSignalExplanation(stockSymbol, signal, indicators, stockData) {
    const prompt = `
אתה אנליסט שוק מומחה. אנליזה של ${stockSymbol}:
- Signal: ${signal.signal}
- RSI: ${indicators.rsi?.toFixed(2) || 'N/A'}
- MA50: ${indicators.ma50?.toFixed(2) || 'N/A'}
- Current Price: $${stockData.price?.toFixed(2) || 'N/A'}
- Volume Ratio: ${stockData.volumeRatio?.toFixed(1) || 'N/A'}%

כתוב הסבר קצר בעברית (עד 100 מילים) למה הייתה התוצאה של ${signal.signal}. כלול הערות על כל אינדיקטור רלוונטי.
ציין "מקור הנתונים: Yahoo Finance"`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (error) {
      console.error('Claude API error:', error);
      return `Unable to generate explanation for ${signal.signal} signal`;
    }
  }
}

module.exports = { ClaudeService };
