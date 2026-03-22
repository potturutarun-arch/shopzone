import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, ShieldCheck, ArrowLeft, Zap } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (products && products.length > 0) {
      const found = products.find(p => p.id === parseInt(id));
      setProduct(found);
    }
  }, [id, products]);

  if (loading) return null;

  if (!product) {
    return (
      <main className="app-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Return to Home</Link>
      </main>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <main className="app-container">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#666', textDecoration: 'none', marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Shopping
      </Link>
      
      <div className="content-section" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Left Image Side */}
        <div className="product-image-container" style={{ flex: '1 1 400px', background: 'var(--card-bg)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-color, #eee)', textAlign: 'center' }}>
          <img 
            src={product.img} 
            alt={product.name} 
            style={{ width: '100%', maxWidth: '350px', height: 'auto', objectFit: 'contain', background: '#fff', padding: '10px', borderRadius: '8px' }} 
          />
        </div>

        {/* Right Detail Side */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.category}
          </div>
          
          <h1 style={{ fontSize: '28px', margin: '0 0 15px', color: 'var(--text-color)', lineHeight: '1.2' }}>
            {product.name}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#388e3c', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
              {product.rating} <Star size={14} fill="white" />
            </div>
            <span style={{ color: 'var(--text-light, #888)', fontSize: '14px' }}>{product.reviews.toLocaleString()} Ratings & Reviews</span>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <span className="price-now" style={{ fontSize: '32px' }}>
              {formatCurrency(product.price)}
            </span>
            {product.oldPrice && (
              <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '16px', marginLeft: '12px' }}>
                {formatCurrency(product.oldPrice)}
              </span>
            )}
            
            {!product.inStock && (
              <div style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: '10px' }}>Currently Out of Stock</div>
            )}
          </div>

          <div className="product-desc-box" style={{ marginBottom: '30px', padding: '20px', background: 'var(--icon-bg)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: 'var(--text-color)' }}>Product Description</h3>
            <p style={{ margin: 0, color: 'var(--text-light, #555)', lineHeight: '1.6' }}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#388e3c', fontWeight: 'bold', marginBottom: '30px' }}>
            <ShieldCheck size={20} /> Safe and Secure Payments. 100% Authentic products.
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              style={{ 
                flex: 1, 
                padding: '16px', 
                background: product.inStock ? 'var(--accent)' : '#ccc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '18px', 
                fontWeight: 'bold', 
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                transition: 'background 0.3s'
              }}
            >
              <ShoppingCart size={20} /> {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={!product.inStock}
              style={{ 
                flex: 1, 
                padding: '16px', 
                background: product.inStock ? '#fb641b' : '#ccc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '18px', 
                fontWeight: 'bold', 
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                transition: 'background 0.3s'
              }}
            >
              <Zap size={20} /> BUY NOW
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
