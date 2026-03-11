import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Phone } from 'lucide-react';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  
  // Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP state
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [otpStep, setOtpStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP
  const [otpCode, setOtpCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { login, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const res = await sendOtp(identifier);
      setMessage(res.message);
      setOtpStep(2);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      await verifyOtp(identifier, otpCode);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', minHeight: '80vh' }}>
      
      <div style={{ width: '100%', maxWidth: '450px', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: 'var(--primary)', padding: '15px', borderRadius: '50%', color: 'white' }}>
            <LogIn size={32} />
          </div>
        </div>
        
        <h1 style={{ textAlign: 'center', fontSize: '24px', margin: '0 0 10px', color: '#212121' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '25px', fontSize: '14px' }}>Sign in securely to your ShopZone account.</p>
        
        {/* Login Method Toggle */}
        <div style={{ display: 'flex', marginBottom: '25px', background: '#f5f5f5', borderRadius: '8px', padding: '4px' }}>
          <button 
            type="button"
            onClick={() => { setLoginMethod('password'); setError(''); setMessage(''); }}
            style={{ 
              flex: 1, 
              padding: '10px 0', 
              background: loginMethod === 'password' ? 'white' : 'transparent', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: loginMethod === 'password' ? '600' : '400',
              boxShadow: loginMethod === 'password' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              color: loginMethod === 'password' ? 'var(--primary)' : '#666'
            }}
          >
            Password
          </button>
          <button 
            type="button"
            onClick={() => { setLoginMethod('otp'); setError(''); setMessage(''); }}
            style={{ 
              flex: 1, 
              padding: '10px 0', 
              background: loginMethod === 'otp' ? 'white' : 'transparent', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: loginMethod === 'otp' ? '600' : '400',
              boxShadow: loginMethod === 'otp' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              color: loginMethod === 'otp' ? 'var(--primary)' : '#666'
            }}
          >
            OTP Login
          </button>
        </div>
        
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #ef9a9a' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #a5d6a7' }}>
            {message}
          </div>
        )}

        {loginMethod === 'password' ? (
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                placeholder="Password" 
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
                background: isLoading ? '#ccc' : 'var(--primary)', 
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          otpStep === 1 ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="input-group" style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input 
                  type="text" 
                  placeholder="Email or Phone Number" 
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 45px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || !identifier.trim()}
                style={{ 
                  padding: '16px', 
                  background: (isLoading || !identifier.trim()) ? '#ccc' : 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: (isLoading || !identifier.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s',
                  marginTop: '10px'
                }}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="input-group" style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP (e.g. 123456)" 
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ width: '100%', padding: '14px 14px 14px 45px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none', letterSpacing: '4px', textAlign: 'center' }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || otpCode.length !== 6}
                style={{ 
                  padding: '16px', 
                  background: (isLoading || otpCode.length !== 6) ? '#ccc' : 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: (isLoading || otpCode.length !== 6) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s',
                  marginTop: '10px'
                }}
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
              
              <button 
                type="button"
                onClick={() => { setOtpStep(1); setOtpCode(''); setMessage(''); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline'
                }}
              >
                Change Email / Phone
              </button>
            </form>
          )
        )}

        <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#666', fontSize: '14px' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
