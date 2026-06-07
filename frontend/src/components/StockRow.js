import React from 'react';
import './StockRow.css';

function StockRow({ stock, isExpanded, onToggle }) {
  const signal = stock.latestSignal?.signal || 'HOLD';
  const indicators = stock.latestIndicators || {};
  const data = stock.latestData || {};

  const signalColor = signal === 'BUY' ? 'green' : signal === 'SELL' ? 'red' : 'yellow';

  return (
    <>
      <tr className="stock-row" onClick={onToggle}>
        <td className="col-symbol">
          <span className="symbol-badge">{stock.symbol}</span>
        </td>
        <td className="col-price">
          ${data.price?.toFixed(2) || 'N/A'}
        </td>
        <td className="col-rsi">
          <div className="rsi-value">{indicators.rsi?.toFixed(2) || 'N/A'}</div>
        </td>
        <td className="col-ma50">
          ${indicators.ma50?.toFixed(2) || 'N/A'}
        </td>
        <td className="col-volume">
          {data.volumeRatio?.toFixed(1) || 'N/A'}%
        </td>
        <td className="col-signal">
          <span className={`signal-badge signal-${signalColor}`}>{signal}</span>
        </td>
        <td className="col-actions">
          <button className="expand-btn" title="Click for details">
            {isExpanded ? '▼' : '▶'}
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className="stock-details-row">
          <td colSpan="7">
            <div className="stock-details">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Open</span>
                  <span className="detail-value">${data.open?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">High</span>
                  <span className="detail-value">${data.high?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Low</span>
                  <span className="detail-value">${data.low?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Avg Volume</span>
                  <span className="detail-value">{data.averageVolume ? `${(data.averageVolume / 1e6).toFixed(1)}M` : 'N/A'}</span>
                </div>
              </div>

              <div className="explanation-section">
                <h4>📊 AI Analysis (Hebrew)</h4>
                <div className="explanation-text">
                  {stock.latestSignal?.explanation || 'No analysis available'}
                </div>
              </div>

              {stock.latestSignal?.reason && (
                <div className="reason-section">
                  <h4>🎯 Signal Reasons</h4>
                  <ul className="reason-list">
                    {stock.latestSignal.reason.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {stock.latestData?.timestamp && (
                <div className="timestamp">
                  Updated: {new Date(stock.latestData.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default StockRow;
