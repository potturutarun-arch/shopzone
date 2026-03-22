import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Phone, ArrowLeft, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { login, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const handleEmailSubmit = async (e) => {
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

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      if (!isOtpSent) {
        setMessage('Sending secure OTP via SMS...');
        await sendOtp(phone);
        setIsOtpSent(true);
        setMessage(`OTP sent to ${phone}. (Check console or use 1234 for demo)`);
      } else {
        await verifyOtp(phone, otp);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Error executing action');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: '20px' }}>
      
      {/* Absolute Back Button */}
      <Link to="/" style={{ position: 'absolute', top: '30px', left: '40px', display: 'flex', alignItems: 'center', gap: '8px', color: '#555', textDecoration: 'none', fontWeight: 'bold' }}>
        <ArrowLeft size={20} /> Back to Store
      </Link>

      {/* Premium Container */}
      <div style={{ display: 'flex', width: '100%', maxWidth: '1000px', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
        
        {/* Left Side: Aesthetic Branding */}
        <div style={{ flex: '1', display: 'none', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', padding: '60px', color: 'white', flexDirection: 'column', justifyContent: 'center', minHeight: '600px', position: 'relative' }} className="desktop-flex">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.2, backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '48px', margin: '0 0 20px', lineHeight: '1.2', fontWeight: '800' }}>Discover Premium Quality.</h1>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', lineHeight: '1.5' }}>Join thousands of verified buyers unlocking exclusive deals, swift checkouts, and priority customer care.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.1)', padding: '15px 25px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <ShieldCheck size={32} color="#4ade80" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>100% Secure</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>End-to-End Encrypted Session</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div style={{ flex: '1', padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#ffffff', position: 'relative' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px', color: 'white' }}>
              <LogIn size={24} />
            </div>
            <h2 style={{ fontSize: '28px', margin: 0, color: '#111' }}>Welcome Back</h2>
          </div>
          
          {/* Custom Pill Toggle for Method Selection */}
          <div style={{ display: 'flex', marginBottom: '30px', background: '#f1f5f9', borderRadius: '12px', padding: '6px' }}>
            <button 
              type="button"
              onClick={() => { setLoginMethod('email'); setError(''); setMessage(''); }}
              style={{ 
                flex: 1, padding: '12px 0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: loginMethod === 'email' ? 'white' : 'transparent', 
                fontWeight: loginMethod === 'email' ? 'bold' : '600',
                color: loginMethod === 'email' ? 'var(--primary)' : '#64748b',
                boxShadow: loginMethod === 'email' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <Mail size={16} /> Email
            </button>
            <button 
              type="button"
              onClick={() => { setLoginMethod('phone'); setError(''); setMessage(''); }}
              style={{ 
                flex: 1, padding: '12px 0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: loginMethod === 'phone' ? 'white' : 'transparent', 
                fontWeight: loginMethod === 'phone' ? 'bold' : '600',
                color: loginMethod === 'phone' ? 'var(--primary)' : '#64748b',
                boxShadow: loginMethod === 'phone' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <Phone size={16} /> Phone
            </button>
          </div>
          
          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ⚠️ {error}
            </div>
          )}

          {message && (
            <div style={{ background: '#f0fdf4', color: '#15803d', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ✓ {message}
            </div>
          )}

          {/* Form Area */}
          {loginMethod === 'email' ? (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc' }} 
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '16px 16px 16px 48px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc' }} 
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                style={{ 
                  padding: '18px', 
                  background: isLoading ? '#cbd5e1' : 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s, transform 0.1s',
                  marginTop: '10px',
                  boxShadow: '0 10px 20px -10px var(--primary)'
                }}
                onMouseDown={(e) => { if(!isLoading) e.target.style.transform = 'scale(0.98)' }}
                onMouseUp={(e) => { if(!isLoading) e.target.style.transform = 'scale(1)' }}
                onMouseLeave={(e) => { if(!isLoading) e.target.style.transform = 'scale(1)' }}
              >
                {isLoading ? 'Authenticating...' : 'Sign In Securely'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Phone size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <div style={{ position: 'absolute', left: '45px', top: '50%', transform: 'translateY(-50%)', color: '#333', fontWeight: 'bold' }}>+91</div>
                <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  required
                  disabled={isOtpSent}
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ width: '100%', padding: '16px 16px 16px 85px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', background: isOtpSent ? '#e2e8f0' : '#f8fafc', letterSpacing: '2px' }} 
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {isOtpSent && (
                <div style={{ position: 'relative', marginTop: '-5px' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    placeholder="Enter 4-digit OTP (1234)" 
                    required
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{ width: '100%', padding: '16px 16px 16px 48px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc', letterSpacing: '8px', textAlign: 'center' }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              )}

              <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                {isOtpSent ? "Enter the verification code sent to your phone." : "By proceeding, you consent to receive SMS verification codes."}
              </div>

              <button 
                type="submit" 
                disabled={isLoading || phone.length !== 10 || (isOtpSent && otp.length !== 4)}
                style={{ 
                  padding: '18px', 
                  background: (isLoading || phone.length !== 10 || (isOtpSent && otp.length !== 4)) ? '#cbd5e1' : 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: (isLoading || phone.length !== 10 || (isOtpSent && otp.length !== 4)) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s',
                  marginTop: '10px',
                  boxShadow: (isLoading || phone.length !== 10 || (isOtpSent && otp.length !== 4)) ? 'none' : '0 10px 20px -10px var(--primary)'
                }}
              >
                {isLoading ? 'Processing...' : (isOtpSent ? 'Verify & Login' : 'Request OTP & Login')}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b', fontSize: '15px' }}>
            New to ShopZone? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Create an account</Link>
          </div>
          
        </div>
      </div>
    </main>
  );
};

export default Login;
