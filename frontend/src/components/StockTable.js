import React, { useState } from 'react';
import './StockTable.css';
import StockRow from './StockRow';

function StockTable({ stocks }) {
  const [expandedSymbol, setExpandedSymbol] = useState(null);
  const [filterSignal, setFilterSignal] = useState('ALL');

  const filteredStocks = stocks.filter(stock => {
    if (filterSignal === 'ALL') return true;
    return stock.latestSignal?.signal === filterSignal;
  });

  return (
    <div className="stock-table-container">
      <div className="table-header">
        <h2>Stock Analysis Results</h2>
        <div className="filters">
          <button
            className={filterSignal === 'ALL' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterSignal('ALL')}
          >
            All ({stocks.length})
          </button>
          <button
            className={filterSignal === 'BUY' ? 'filter-btn active green' : 'filter-btn'}
            onClick={() => setFilterSignal('BUY')}
          >
            Buy ({stocks.filter(s => s.latestSignal?.signal === 'BUY').length})
          </button>
          <button
            className={filterSignal === 'SELL' ? 'filter-btn active red' : 'filter-btn'}
            onClick={() => setFilterSignal('SELL')}
          >
            Sell ({stocks.filter(s => s.latestSignal?.signal === 'SELL').length})
          </button>
          <button
            className={filterSignal === 'HOLD' ? 'filter-btn active yellow' : 'filter-btn'}
            onClick={() => setFilterSignal('HOLD')}
          >
            Hold ({stocks.filter(s => s.latestSignal?.signal === 'HOLD').length})
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th className="col-symbol">Symbol</th>
              <th className="col-price">Price</th>
              <th className="col-rsi">RSI</th>
              <th className="col-ma50">MA50</th>
              <th className="col-volume">Volume</th>
              <th className="col-signal">Signal</th>
              <th className="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map(stock => (
                <StockRow
                  key={stock.symbol}
                  stock={stock}
                  isExpanded={expandedSymbol === stock.symbol}
                  onToggle={() =>
                    setExpandedSymbol(
                      expandedSymbol === stock.symbol ? null : stock.symbol
                    )
                  }
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No stocks match the selected filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockTable;
