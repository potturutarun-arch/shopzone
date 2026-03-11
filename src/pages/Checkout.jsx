import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser, isLoggedIn, addOrder } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // default to Razorpay
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Extract Default Address if available
  const defaultAddress = currentUser?.addresses?.find(a => a.isDefault);

  // Auto-fill logged in user data, or leave blank if context hasn't caught up
  const [formData, setFormData] = useState({
    name: currentUser?.name || '', 
    email: currentUser?.email || '', 
    address: defaultAddress?.street || '', 
    city: defaultAddress?.city || '', 
    zip: defaultAddress?.zip || ''
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'Razorpay') {
      // Simulate Razorpay UI popup flow
      setIsProcessingPayment(true);
      setTimeout(async () => {
        setIsProcessingPayment(false);
        const mockRazorpayPaymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
          await addOrder({
            items: [...cartItems],
            total: cartTotal,
            shipping: { ...formData }
          }, 'Razorpay', mockRazorpayPaymentId, 'Paid');
          clearCart();
          setIsSuccess(true);
        } catch (err) {
          alert("Failed to process order: " + err.message);
        }
      }, 1500); // Wait 1.5s to simulate network & user interaction
    } else {
      // Cash on Delivery
      try {
        await addOrder({
          items: [...cartItems],
          total: cartTotal,
          shipping: { ...formData }
        }, 'Cash on Delivery', null, 'Pending');
        clearCart();
        setIsSuccess(true);
      } catch (err) {
        alert("Failed to process order: " + err.message);
      }
    }
  };

  // Guard Route: If not logged in, force them to login before viewing checkout
  if (!isLoggedIn) {
    navigate('/login', { state: { from: location }, replace: true });
    return null;
  }

  if (isSuccess) {
    return (
      <main className="app-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <CheckCircle size={80} color="#388e3c" style={{ marginBottom: '20px' }} />
        <h1 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--text-light, #555)', marginBottom: '30px', fontSize: '18px' }}>
          Thank you, {formData.name}. Your items will be shipped to {formData.city} shortly.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/dashboard', { state: { activeTab: 'orders' } })} 
            style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
          >
            Track Order
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text-color)', border: '2px solid var(--border-color, #ccc)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="app-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Your Cart is Empty</h2>
        <p>Please add some items to proceed to checkout.</p>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '20px', display: 'inline-block' }}>Return to Shop</Link>
      </main>
    );
  }

  return (
    <main className="app-container">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#666', textDecoration: 'none', marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back
      </Link>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Form Section */}
        <div style={{ flex: '1 1 500px', background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color, #eee)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '24px', color: 'var(--text-color)' }}>Checkout Details</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-light, #555)' }}>Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color, #ccc)', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-light, #555)' }}>Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color, #ccc)', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-light, #555)' }}>Shipping Address</label>
              <input type="text" name="address" required value={formData.address} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color, #ccc)', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-light, #555)' }}>City</label>
                <input type="text" name="city" required value={formData.city} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color, #ccc)', borderRadius: '6px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-light, #555)' }}>Zip Code</label>
                <input type="text" name="zip" required value={formData.zip} onChange={handleInputChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color, #ccc)', borderRadius: '6px' }} />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px', color: 'var(--text-color)' }}>Payment Method</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: paymentMethod === 'Razorpay' ? '2px solid var(--primary)' : '1px solid var(--border-color, #ccc)', borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'Razorpay' ? 'var(--input-bg)' : 'transparent' }}>
                  <input type="radio" name="payment" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Razorpay (Cards, UPI, NetBanking)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: paymentMethod === 'Cash on Delivery' ? '2px solid var(--primary)' : '1px solid var(--border-color, #ccc)', borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'Cash on Delivery' ? 'var(--input-bg)' : 'transparent' }}>
                  <input type="radio" name="payment" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isProcessingPayment} style={{ marginTop: '20px', padding: '16px', background: isProcessingPayment ? '#ccc' : '#fb641b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: isProcessingPayment ? 'not-allowed' : 'pointer', transition: 'background 0.3s' }}>
              {isProcessingPayment ? 'Processing Payment with Razorpay...' : `Place Order - ${formatCurrency(cartTotal)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 300px', background: 'var(--icon-bg)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color, #eee)', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: 'var(--text-color)' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={item.img} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#fff', borderRadius: '4px', border: '1px solid #eee' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', maxWidth: '180px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: 'var(--text-color)' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-light, #666)' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-color, #ddd)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800', color: 'var(--text-color)' }}>
            <span>Total</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
