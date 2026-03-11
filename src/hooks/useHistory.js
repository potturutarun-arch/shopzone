import { useState, useEffect, useCallback } from 'react';

export const useHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('user_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const viewProduct = useCallback((product) => {
    const now = new Date().getTime();
    const expiryTime = 2 * 24 * 60 * 60 * 1000;

    setHistory(prev => {
      // 1. Remove expired
      let updated = prev.filter(item => (now - item.timestamp) < expiryTime);
      
      // 2. Add new
      const newItem = { ...product, timestamp: now };
      updated = updated.filter(item => item.id !== product.id);
      updated.unshift(newItem);
      
      // 3. Keep 8
      if (updated.length > 8) updated = updated.slice(0, 8);
      
      localStorage.setItem('user_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { history, viewProduct };
};
