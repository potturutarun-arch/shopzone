import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      await signup(name, email, password);
      // On success, go home
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', minHeight: '80vh' }}>
      
      <div style={{ width: '100%', maxWidth: '450px', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: '#388e3c', padding: '15px', borderRadius: '50%', color: 'white' }}>
            <UserPlus size={32} />
          </div>
        </div>
        
        <h1 style={{ textAlign: 'center', fontSize: '24px', margin: '0 0 10px', color: '#212121' }}>Create an Account</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' }}>Join ShopZone for exclusive deals and faster checkout.</p>
        
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #ef9a9a' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="input-group" style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Full Name" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 45px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }} 
            />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 45px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }} 
            />
          </div>
          
          <div className="input-group" style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="password" 
              placeholder="Password (min 6 characters)" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 45px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '16px', 
              background: isLoading ? '#ccc' : '#388e3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              marginTop: '10px'
            }}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#666', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#388e3c', fontWeight: 'bold', textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </main>
  );
};

export default Signup;
