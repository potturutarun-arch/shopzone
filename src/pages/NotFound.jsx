import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ 
      minHeight: '70vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <ShieldAlert size={80} color="#d32f2f" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '48px', margin: '0 0 10px', color: '#212121' }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: '0 0 20px', color: '#555' }}>Secure Error: Page Not Found</h2>
      <p style={{ maxWidth: '500px', color: '#777', lineHeight: '1.6', marginBottom: '30px' }}>
        The link you clicked may be broken, or the page may have been removed or 
        restricted for security reasons. Please return safely to our verified homepage.
      </p>
      <Link 
        to="/" 
        style={{ 
          padding: '12px 24px', 
          background: 'var(--primary)', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
