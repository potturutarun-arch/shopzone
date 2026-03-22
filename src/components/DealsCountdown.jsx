import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useHistory } from '../hooks/useHistory';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const DealsCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); // 12 hours
  const { addToCart } = useCart();
  const { viewProduct } = useHistory();
  const navigate = useNavigate();

  const { products, loading } = useProducts();
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const discounted = products.filter(p => p.oldPrice);
      setDeals(discounted.slice(0, 4).map(item => {
        const discountPercent = Math.round((1 - (item.price / item.oldPrice)) * 100);
        return {...item, discountPercent: `${discountPercent}%`};
      }));
    }
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isExpired = timeLeft <= 0;

  const handleProductClick = (product) => {
    if(!isExpired) {
      viewProduct(product);
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if(!isExpired) addToCart(product);
  };

  if (loading) return null;

  return (
    <div className="content-section deals-container" style={{ opacity: isExpired ? 0.5 : 1, pointerEvents: isExpired ? 'none' : 'auto' }}>
      <div className="section-header">
        <h3 className="section-title deals-title">
          Deals of the Day <Clock size={24} />
        </h3>
        <div className="timer">
          {isExpired ? "EXPIRED" : formatTime(timeLeft)}
        </div>
      </div>

      <div className="deals-grid">
        {deals.map(deal => (
          <div className="deal-card" key={deal.id} onClick={() => handleProductClick(deal)}>
            <div className="discount-badge">{deal.discountPercent} OFF</div>
            <div className="deal-image-box">
              <img src={deal.img} alt={deal.name} />
            </div>
            
            <div className="deal-info">
              <div style={{fontWeight: 'bold', fontSize: '15px'}}>{deal.name}</div>
              <div style={{marginTop: '5px'}}>
                <span className="price-now">{formatCurrency(deal.price)}</span>
                <span className="price-old">{formatCurrency(deal.oldPrice)}</span>
              </div>
              <span className="lowest-label">Lowest Price since launch!</span>
            </div>
            
            <button className="add-to-cart" onClick={(e) => handleAddToCart(e, deal)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsCountdown;
