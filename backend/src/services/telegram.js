const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.warn('TELEGRAM_BOT_TOKEN not set, Telegram alerts disabled');
      this.bot = null;
      return;
    }

    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  async sendAlert(message) {
    if (!this.bot || !this.chatId) {
      console.log('Telegram not configured, skipping alert');
      return;
    }

    try {
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('Telegram error:', error.message);
    }
  }

  async sendSignalAlert(stock) {
    if (!this.bot || !this.chatId) return;

    const signal = stock.latestSignal?.signal || 'HOLD';
    const signalEmoji = signal === 'BUY' ? '🟢' : signal === 'SELL' ? '🔴' : '🟡';

    const message = `
${signalEmoji} <b>${stock.symbol}</b>
<b>Signal:</b> ${signal}
<b>Price:</b> $${stock.latestData?.price?.toFixed(2) || 'N/A'}
<b>RSI:</b> ${stock.latestIndicators?.rsi?.toFixed(2) || 'N/A'}
<b>MA50:</b> $${stock.latestIndicators?.ma50?.toFixed(2) || 'N/A'}
<b>Volume:</b> ${stock.latestData?.volumeRatio?.toFixed(1) || 'N/A'}%

<i>${stock.latestSignal?.explanation || 'No explanation available'}</i>
    `;

    await this.sendAlert(message);
  }
}

module.exports = { TelegramService };
