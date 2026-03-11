import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ecommerce_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('ecommerce_token') || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecommerce_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ecommerce_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ecommerce_token', token);
    } else {
      localStorage.removeItem('ecommerce_token');
    }
  }, [token]);

  // Real API signup
  const signup = async (name, email, password) => {
    try {
      const resp = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await resp.json();
      if (!resp.ok) {
        const errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        throw new Error(errorMsg || 'Signup failed');
      }
      
      setCurrentUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Real API login
  const login = async (email, password) => {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      });
      const data = await resp.json();
      if (!resp.ok) {
        const errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        throw new Error(errorMsg || 'Login failed');
      }
      
      setCurrentUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  const addOrder = async (orderData, paymentMethod = "Razorpay", paymentId = null, paymentStatus = "Paid") => {
    if (!currentUser) return;
    
    // Safety check: if an old localStorage bug left currentUser.id undefined, reject the order early
    if (!currentUser.id) {
        throw new Error("Local session corrupted. Please logout and login again.");
    }
    
    // Format for backend
    const apiPayload = {
      total: orderData.total,
      items: orderData.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      payment_method: paymentMethod,
      payment_id: paymentId,
      payment_status: paymentStatus
    };
    
    try {
      const resp = await fetch(`/api/orders?user_id=${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiPayload)
      });
      
      const data = await resp.json();
      if (!resp.ok) {
        const errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        throw new Error(errorMsg || 'Failed to place order');
      }
      
      // Update local context for immediate UX without needing to fetch User/Me right now
      const newOrder = {
        ...orderData,
        id: data.message,
        date: new Date().toISOString(),
        status: 'Processing',
        payment_method: paymentMethod,
        payment_status: paymentStatus
      };
      
      setCurrentUser(prev => ({
        ...prev,
        orders: [newOrder, ...(prev.orders || [])]
      }));
      
      return data.message;
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!currentUser || !currentUser.id) return;

    try {
      const resp = await fetch(`/api/orders/${orderId}/cancel?user_id=${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.detail || 'Failed to cancel order');
      }

      // Update local context order list
      setCurrentUser(prev => ({
        ...prev,
        orders: prev.orders.map(o => 
          o.id === orderId 
            ? { ...o, status: 'Cancelled', payment_status: o.payment_status === 'Paid' ? 'Refunded' : 'Cancelled' } 
            : o
        )
      }));

      return data.message;
    } catch (err) {
      console.error("Error cancelling order:", err);
      throw new Error(err.message);
    }
  };

  const updateProfile = (profileData) => {
    if (!currentUser) return;
    setCurrentUser(prev => ({
      ...prev,
      ...profileData
    }));
  };

  const addAddress = (address) => {
    if (!currentUser) return;
    const newAddr = {
      ...address,
      id: `ADDR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      isDefault: currentUser.addresses?.length === 0
    };
    setCurrentUser(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), newAddr]
    }));
  };

  const removeAddress = (id) => {
    if (!currentUser) return;
    setCurrentUser(prev => ({
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== id)
    }));
  };

  const setDefaultAddress = (id) => {
    if (!currentUser) return;
    setCurrentUser(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    }));
  };

  // Real OTP sending
  const sendOtp = async (identifier) => {
    try {
      const resp = await fetch(`/api/auth/send-otp?identifier=${encodeURIComponent(identifier)}`, {
        method: 'POST'
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Failed to send OTP');
      return { success: true, message: data.message };
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Real OTP verification
  const verifyOtp = async (identifier, otp) => {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Invalid OTP');
      
      setCurrentUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Real API claim gift card
  const claimGiftCard = async (code) => {
    if (!currentUser) return Promise.reject('Please login first');
    try {
      const resp = await fetch(`/api/wallet/claim-gift-card?user_id=${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Failed to claim gift card');
      
      // Calculate how much was added by subtracting new balance
      const newBalance = data.pay_zone_balance;
      const amountAdded = newBalance - (currentUser.payZoneBalance || 0);
      
      setCurrentUser(prev => ({ ...prev, payZoneBalance: newBalance }));
      return { success: true, amount: amountAdded };
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Real API UPI transfer
  const transferUpi = async (upiId, amount) => {
    if (!currentUser) return Promise.reject('Please login first');
    try {
      const resp = await fetch(`/api/wallet/transfer-upi?user_id=${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ upi_id: upiId, amount: Number(amount) })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Transfer failed');
      
      setCurrentUser(prev => ({ ...prev, payZoneBalance: data.pay_zone_balance }));
      return { success: true, upiId, amount };
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn: !!currentUser,
      signup,
      login,
      logout,
      sendOtp,
      verifyOtp,
      addOrder,
      cancelOrder,
      updateProfile,
      addAddress,
      removeAddress,
      setDefaultAddress,
      claimGiftCard,
      transferUpi
    }}>
      {children}
    </AuthContext.Provider>
  );
};
