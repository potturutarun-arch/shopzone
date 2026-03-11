import React, { useState, useEffect } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useCart } from '../context/CartContext';
import { Sparkles, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductDB } from '../data/mockDataGenerator';

const Suggestions = () => {
  const { history, viewProduct } = useHistory();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Recommendation logic based on most viewed category
    const categoriesClicked = history.map(item => item.category);
    
    let favoriteCategory = null;
    if (categoriesClicked.length > 0) {
      favoriteCategory = categoriesClicked.sort((a,b) =>
        categoriesClicked.filter(v => v===a).length - categoriesClicked.filter(v => v===b).length
      ).pop();
    }

    let recs = ProductDB.filter(p => p.category === favoriteCategory);
    
    // If no history or not enough from category, mix
    if (recs.length < 4) {
      recs = [...recs, ...ProductDB.filter(p => p.category !== favoriteCategory)].slice(0, 6);
    } else {
      recs = recs.slice(0, 6); // Limit to 6
    }

    setRecommendations(recs);
  }, [history]);

  const handleProductClick = (product) => {
    viewProduct(product);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#fbc02d" /> 
          Suggested for You
        </h3>
        <button className="see-all" onClick={() => navigate('/search')}>See All</button>
      </div>

      <div className="suggestion-grid">
        {recommendations.map(product => (
          <div className="suggested-card" key={product.id} onClick={() => handleProductClick(product)}>
            <img src={product.img} alt={product.name} />
            <div className="product-name">{product.name}</div>
            <div className="price-tag">{formatCurrency(product.price)}</div>
            <button className="add-to-cart" onClick={(e) => handleAddToCart(e, product)}>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'}}>
                <ShoppingCart size={14} /> Add
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
