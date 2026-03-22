import React, { createContext, useState, useContext, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Ensure products exist in SQL on first run by calling the seed route
        await fetch(`${API_BASE}/api/products/seed`, { method: 'POST' }).catch(() => {});
        
        const response = await fetch(`${API_BASE}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Transform the DB structure slightly if needed for the UI mock structure
        const formattedData = data.map(p => ({
          ...p,
          oldPrice: p.old_price,
          inStock: p.in_stock
        }));
        
        setProducts(formattedData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  const getProductsByCategory = (category) => {
    return products.filter(p => p.category === category);
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, getProductById, getProductsByCategory }}>
      {children}
    </ProductContext.Provider>
  );
};
