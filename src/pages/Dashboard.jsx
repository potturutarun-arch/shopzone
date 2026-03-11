import React, { useState } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, Settings, LogOut, ChevronRight, MapPin, CreditCard, Camera, Trash2, Plus, Star, Gift, Wallet, Send } from 'lucide-react';

const AVATARS = [
  'https://loremflickr.com/150/150/portrait?lock=1',
  'https://loremflickr.com/150/150/portrait?lock=2',
  'https://loremflickr.com/150/150/portrait?lock=3',
  'https://loremflickr.com/150/150/portrait?lock=4',
];

const Dashboard = () => {
  const { currentUser, isLoggedIn, logout, updateProfile, addAddress, removeAddress, setDefaultAddress, claimGiftCard, cancelOrder, transferUpi } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  
  React.useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Pay Zone State
  const [giftCardCode, setGiftCardCode] = useState('');
  const [claimStatus, setClaimStatus] = useState({ loading: false, error: '', success: '' });
  
  // UPI State
  const [upiForm, setUpiForm] = useState({ id: '', amount: '' });
  const [upiStatus, setUpiStatus] = useState({ loading: false, error: '', success: '' });
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  
  // Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '', city: '', zip: ''
  });

  // Guard: Must be logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleClaimGiftCard = async (e) => {
    e.preventDefault();
    setClaimStatus({ loading: true, error: '', success: '' });
    try {
      const res = await claimGiftCard(giftCardCode);
      setClaimStatus({ loading: false, error: '', success: `Successfully added ${formatCurrency(res.amount)} to your wallet!` });
      setGiftCardCode('');
      setTimeout(() => setClaimStatus(prev => ({ ...prev, success: '' })), 5000);
    } catch (err) {
      setClaimStatus({ loading: false, error: err, success: '' });
    }
  };

  const handleUpiTransfer = async (e) => {
    e.preventDefault();
    setUpiStatus({ loading: true, error: '', success: '' });
    try {
      const res = await transferUpi(upiForm.id, upiForm.amount);
      setUpiStatus({ loading: false, error: '', success: `Successfully sent ${formatCurrency(res.amount)} to ${res.upiId}!` });
      setUpiForm({ id: '', amount: '' });
      setTimeout(() => setUpiStatus(prev => ({ ...prev, success: '' })), 5000);
    } catch (err) {
      setUpiStatus({ loading: false, error: err, success: '' });
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      try {
        await cancelOrder(orderId);
        alert("Order successfully cancelled.");
      } catch (err) {
        alert("Failed to cancel order: " + err.message);
      }
    }
  };

  const currentOrders = currentUser.orders || [];

  // Helper component for the tracker
  const OrderTracker = ({ status }) => {
    if (status === 'Cancelled') {
      return (
        <div style={{ padding: '15px', background: '#ffebee', borderLeft: '4px solid #f44336', borderRadius: '6px', margin: '15px 0' }}>
          <h4 style={{ margin: 0, color: '#c62828', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={18} /> Order Cancelled
          </h4>
          <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#b71c1c' }}>This order has been cancelled and any payments have been refunded to the original source.</p>
        </div>
      );
    }

    const steps = ['Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;

    return (
      <div style={{ margin: '20px 0', padding: '15px 0' }}>
        <h4 style={{ margin: '0 0 15px', color: '#2e7d32' }}>Status: {status}</h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Progress Line */}
          <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '4px', background: '#eee', zIndex: 0, transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '10%', width: `${(currentStepIndex / (steps.length - 1)) * 80}%`, height: '4px', background: 'var(--primary)', zIndex: 1, transform: 'translateY(-50%)', transition: 'width 0.3s' }} />
          
          {/* Bubbles */}
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            return (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isCompleted ? 'var(--primary)' : '#eee', border: isCompleted ? 'none' : '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  {isCompleted && <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%' }} />}
                </div>
                <span style={{ marginTop: '8px', fontSize: '12px', fontWeight: 'bold', color: isCompleted ? '#333' : '#999' }}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  return (
    <main className="app-container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Sidebar Navigation */}
        <aside style={{ flex: '1 1 250px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 15px', border: '3px solid var(--primary)' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 15px', fontWeight: 'bold' }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 style={{ margin: '0 0 5px', fontSize: '20px' }}>{currentUser.name}</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{currentUser.email}</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('overview')}
              style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'overview' ? '#f0f7ff' : 'transparent', color: activeTab === 'overview' ? 'var(--primary)' : '#444', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'overview' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              <User size={18} /> Account Overview
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'orders' ? '#f0f7ff' : 'transparent', color: activeTab === 'orders' ? 'var(--primary)' : '#444', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'orders' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              <Package size={18} /> My Orders
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'settings' ? '#f0f7ff' : 'transparent', color: activeTab === 'settings' ? 'var(--primary)' : '#444', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'settings' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              <Settings size={18} /> Profile Settings
            </button>
            <button 
              onClick={logout}
              style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', color: '#d32f2f', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>

        {/* Dynamic Content Area */}
        <div style={{ flex: '3 1 600px', background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '24px', margin: '0 0 20px', color: '#212121' }}>Welcome to your Dashboard</h2>
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* Left Side: Stats and Activity */}
                <div style={{ flex: '2 1 400px' }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ flex: 1, padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee' }}>
                      <div style={{ color: '#666', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Total Orders</div>
                      <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>{currentOrders.length}</div>
                    </div>
                    <div style={{ flex: 1, padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee' }}>
                      <div style={{ color: '#666', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Account Status</div>
                      <div style={{ display: 'inline-block', padding: '4px 12px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Verified Buyer</div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', margin: '0 0 15px' }}>Recent Activity</h3>
                  {currentOrders.length > 0 ? (
                    <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Order {currentOrders[0].id}</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>Placed on {formatDate(currentOrders[0].date)}</div>
                      </div>
                      <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                        View Details <ChevronRight size={16} />
                      </button>
                    </div>
                  ) : (
                    <p style={{ color: '#666', fontSize: '15px' }}>You haven't placed any orders yet. Time to start shopping!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontSize: '24px', margin: '0 0 20px', color: '#212121' }}>Order History</h2>
              
              {currentOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
                  <Package size={60} style={{ color: '#ccc', marginBottom: '20px' }} />
                  <h3 style={{ margin: '0 0 10px' }}>No Orders Found</h3>
                  <p style={{ color: '#666', marginBottom: '20px' }}>Looks like you haven't made your first purchase.</p>
                  <Link to="/" style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--primary)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Browse Products</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {currentOrders.map(order => (
                    <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                      {/* Order Header */}
                      <div style={{ background: '#f8f9fa', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                        <div style={{ display: 'flex', gap: '30px' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Order Placed</div>
                            <div style={{ fontSize: '14px' }}>{formatDate(order.date)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Total</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{formatCurrency(order.total)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Ship To</div>
                            <div style={{ fontSize: '14px', color: 'var(--primary)', cursor: 'pointer' }}>{order.shipping.name}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Payment</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: order.payment_status === 'Paid' ? '#2e7d32' : '#f57c00' }}>
                              {order.payment_method} ({order.payment_status})
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Order # {order.id}</div>
                          <Link to="#" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>View Invoice</Link>
                        </div>
                      </div>

                      {/* Order Tracking & Items */}
                      <div style={{ padding: '0 20px 20px 20px' }}>
                        
                        <OrderTracker status={order.status} />

                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                            <button 
                              onClick={() => handleCancel(order.id)}
                              style={{ padding: '8px 16px', background: 'white', border: '1px solid #f44336', color: '#f44336', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                              onMouseOver={e => { e.target.style.background = '#ffebee'; }}
                              onMouseOut={e => { e.target.style.background = 'white'; }}
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                              <img src={item.img} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '6px', padding: '5px' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>{item.name}</div>
                                <div style={{ fontSize: '13px', color: '#666' }}>Return window closed on {formatDate(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)}</div>
                                <div style={{ fontSize: '14px', marginTop: '5px', fontWeight: 'bold' }}>Qty: {item.quantity}  ×  {formatCurrency(item.price)}</div>
                              </div>
                              <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#444' }}>Buy it again</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{ fontSize: '24px', margin: '0 0 20px', color: '#212121' }}>Profile Settings</h2>
              
              <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                {/* Left Col - Profile */}
                <div style={{ flex: '1 1 300px' }}>
                  <h3 style={{ fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Personal Information</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', marginBottom: '10px' }}>Choose Avatar</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {AVATARS.map((url, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => updateProfile({ avatar: url })}
                          style={{ 
                            width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer',
                            border: currentUser.avatar === url ? '3px solid var(--primary)' : '2px solid transparent',
                            opacity: currentUser.avatar === url ? 1 : 0.6, transition: 'all 0.2s'
                          }}
                        >
                          <img src={url} alt="Avatar option" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <form 
                    onSubmit={(e) => { 
                      e.preventDefault(); 
                      updateProfile(profileForm);
                      alert('Profile updated successfully!');
                    }} 
                    style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Full Name</label>
                      <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Email Address</label>
                      <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Mobile Number</label>
                      <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} placeholder="+91" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <button type="submit" style={{ padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Save Changes</button>
                  </form>
                </div>

                {/* Right Col - Addresses */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', margin: 0 }}>Address Book</h3>
                    {!isAddingAddress && (
                      <button onClick={() => setIsAddingAddress(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Plus size={16} /> Add New
                      </button>
                    )}
                  </div>

                  {isAddingAddress && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        addAddress(addressForm);
                        setAddressForm({ street: '', city: '', zip: '' });
                        setIsAddingAddress(false);
                      }}
                      style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                    >
                      <input type="text" placeholder="Street Address" required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="City" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                        <input type="text" placeholder="Zip Code" required value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <button type="submit" style={{ flex: 1, padding: '10px', background: '#388e3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                        <button type="button" onClick={() => setIsAddingAddress(false)} style={{ flex: 1, padding: '10px', background: 'white', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </form>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!currentUser.addresses || currentUser.addresses.length === 0 ? (
                      <p style={{ color: '#666', fontSize: '14px', fontStyle: 'italic' }}>No addresses saved yet.</p>
                    ) : (
                      currentUser.addresses.map((addr) => (
                        <div key={addr.id} style={{ border: addr.isDefault ? '2px solid var(--primary)' : '1px solid #eee', padding: '15px', borderRadius: '8px', background: addr.isDefault ? '#f0f7ff' : 'white', position: 'relative' }}>
                          {addr.isDefault && <div style={{ position: 'absolute', top: '-10px', right: '15px', background: 'var(--primary)', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Default</div>}
                          
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <MapPin size={18} color={addr.isDefault ? 'var(--primary)' : '#999'} style={{ marginTop: '2px' }} />
                            <div>
                              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{currentUser.name}</div>
                              <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.4' }}>
                                {addr.street}<br/>
                                {addr.city}, {addr.zip}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ marginTop: '15px', display: 'flex', gap: '15px', fontSize: '13px', fontWeight: 'bold' }}>
                            {!addr.isDefault && (
                              <span onClick={() => setDefaultAddress(addr.id)} style={{ color: 'var(--primary)', cursor: 'pointer' }}>Set as Default</span>
                            )}
                            <span onClick={() => removeAddress(addr.id)} style={{ color: '#d32f2f', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}><Trash2 size={13} /> Remove</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
