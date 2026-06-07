import React from 'react';
import './SummaryCards.css';

function SummaryCards({ summary }) {
  const cards = [
    {
      title: 'Stocks Scanned',
      value: summary.totalScanned,
      icon: '📊',
      color: 'blue',
    },
    {
      title: 'Buy Signals',
      value: summary.buySignals,
      icon: '🟢',
      color: 'green',
    },
    {
      title: 'Sell Signals',
      value: summary.sellSignals,
      icon: '🔴',
      color: 'red',
    },
    {
      title: 'Hold Signals',
      value: summary.holdSignals,
      icon: '🟡',
      color: 'yellow',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div key={index} className={`card card-${card.color}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <p className="card-title">{card.title}</p>
            <p className="card-value">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
