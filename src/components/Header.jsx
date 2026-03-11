import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, User, LogOut, Moon, Sun, Package } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { currentUser, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="header">
      <Link to="/" className="logo">
        <img src="https://static.vecteezy.com/system/resources/previews/012/905/760/large_2x/zone-logo-design-idea-logo-land-mark-logo-free-vector.jpg" alt="ShopZone Logo" />
        ShopZone
      </Link>

      <div className="search-box-container" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <form className="search-box" onSubmit={handleSearch} style={{ width: '100%', maxWidth: '600px' }}>
          <input 
            type="text" 
            placeholder="Search securely amongst 2000+ products, brands and more..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit"><Search size={18} /></button>
        </form>
      </div>

      <div className="menu">
        <button onClick={toggleDarkMode} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Toggle Theme">
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <select defaultValue="English" style={{ marginLeft: '10px' }}>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Telugu">Telugu</option>
          <option value="Tamil">Tamil</option>
        </select>

        <button className="cart-button-inline" onClick={() => setIsCartOpen(true)}>
          <div className="cart-icon-container">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge" id="cart-count">{cartCount}</span>}
          </div>
          <span className="label">Cart</span>
        </button>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/dashboard" state={{ activeTab: 'orders' }} className="cart-button-inline" style={{ textDecoration: 'none' }}>
              <div className="cart-icon-container">
                <Package size={20} />
              </div>
              <span className="label">Orders</span>
            </Link>
            <Link to="/dashboard" style={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
              <User size={16} /> {currentUser.name}
            </Link>
            <button className="login-btn" onClick={() => { logout(); navigate('/'); }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <LogOut size={16} /> Logout
              </div>
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate('/login')}>
            <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
              <User size={16} /> Login
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
