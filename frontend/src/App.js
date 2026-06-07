import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SummaryCards from './components/SummaryCards';
import StockTable from './components/StockTable';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/stocks`);
      setStocks(response.data);
      setLastScanTime(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch stock data. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualScan = async () => {
    try {
      setLoading(true);
      await axios.get(`${API_BASE}/scan`);
      await fetchStocks();
    } catch (err) {
      setError('Failed to run manual scan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const summary = {
    totalScanned: stocks.length,
    buySignals: stocks.filter(s => s.latestSignal?.signal === 'BUY').length,
    sellSignals: stocks.filter(s => s.latestSignal?.signal === 'SELL').length,
    holdSignals: stocks.filter(s => s.latestSignal?.signal === 'HOLD').length,
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>📊 Stock Pulse</h1>
          <p>AI-Powered Stock Screener with Real-time Analysis</p>
        </div>
        <div className="header-actions">
          <button
            className="scan-button"
            onClick={handleManualScan}
            disabled={loading}
          >
            {loading ? 'Scanning...' : 'Run Scan'}
          </button>
          {lastScanTime && (
            <span className="last-scan">
              Last scan: {lastScanTime.toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        <SummaryCards summary={summary} />

        {loading && stocks.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <StockTable stocks={stocks} />
        )}
      </main>

      <footer className="app-footer">
        <p>Stock Pulse © 2024 | Data from Yahoo Finance | Analysis by Claude AI</p>
      </footer>
    </div>
  );
}

export default App;
