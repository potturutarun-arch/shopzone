import React, { useEffect } from 'react';
import { useHistory } from '../hooks/useHistory';
import { History } from 'lucide-react';

const HistoryDisplay = () => {
  const { history, viewProduct } = useHistory();

  // For testing/mocking initial history state if empty
  useEffect(() => {
    if (history.length === 0) {
      // Pre-fill some mock data so the user sees the feature working
      viewProduct({
        id: 101,
        name: "Slim Fit Shirt",
        category: "Fashion",
        img: "https://cdn-icons-png.flaticon.com/512/3050/3050231.png"
      });
      setTimeout(() => {
        viewProduct({
          id: 102,
          name: "Wireless Buds",
          category: "Electronics",
          img: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png"
        });
      }, 500);
    }
  }, [history.length, viewProduct]);

  if (history.length === 0) return null;

  return (
    <div className="content-section">
      <div className="section-header">
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={20} color="var(--primary)" /> 
          Your Recently Viewed
        </h3>
      </div>
      <div className="history-grid">
        {history.map((item, idx) => (
          <div className="history-card" key={idx}>
            <img src={item.img} alt={item.name} />
            <div>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryDisplay;
