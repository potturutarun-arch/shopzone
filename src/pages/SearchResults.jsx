import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductDB } from '../data/mockDataGenerator';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryQuery = searchParams.get('category') || '';
  const [results, setResults] = useState([]);
  const { addToCart } = useCart();
  const { viewProduct } = useHistory();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const lowerQuery = query.toLowerCase().trim();
    
    if (categoryQuery) {
      // Exact category match
      const filtered = ProductDB.filter(product => product.category === categoryQuery);
      setResults(filtered);
      return;
    }
    
    if (!lowerQuery) {
      setResults(ProductDB);
      return;
    }

    // Filter massive DB for query in name, category, or description
    const filtered = ProductDB.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
    
    setResults(filtered);
  }, [query, categoryQuery]);

  const handleProductClick = (product) => {
    viewProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <main className="app-container">
      <div className="content-section">
        <div className="section-header" style={{ marginBottom: '10px' }}>
          <h2 className="section-title">
            {categoryQuery ? `${categoryQuery} Products` : (query ? `Search Results for "${query}"` : 'All Products')}
          </h2>
        </div>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Showing {results.length} results.
        </p>

        {results.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            <h3>No products found matching your search.</h3>
            <p>Try using more general keywords like "shirt", "phone", or "game".</p>
          </div>
        ) : (
          <div className="suggestion-grid">
            {results.map(product => (
              <div 
                className="suggested-card" 
                key={product.id} 
                onClick={() => handleProductClick(product)}
                style={{ position: 'relative' }}
              >
                {!product.inStock && (
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,0,0,0.8)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    Out of Stock
                  </div>
                )}
                
                <img src={product.img} alt={product.name} />
                <div className="product-name" style={{ fontSize: '14px', lineHeight: '1.4' }}>{product.name}</div>
                
                <div style={{ margin: '8px 0', fontSize: '12px', color: '#ffb300', fontWeight: 'bold' }}>
                  ★ {product.rating} <span style={{ color: '#888', fontWeight: 'normal' }}>({product.reviews})</span>
                </div>

                <div className="price-tag" style={{ fontSize: '18px', color: '#212121' }}>
                  {formatCurrency(product.price)}
                  {product.oldPrice && (
                    <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '13px', marginLeft: '6px' }}>
                      {formatCurrency(product.oldPrice)}
                    </span>
                  )}
                </div>
                
                <button 
                  className="add-to-cart" 
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.inStock}
                  style={{ opacity: product.inStock ? 1 : 0.5, cursor: product.inStock ? 'pointer' : 'not-allowed' }}
                >
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'}}>
                    <ShoppingCart size={16} /> {product.inStock ? 'Add to Cart' : 'Unavailable'}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResults;
