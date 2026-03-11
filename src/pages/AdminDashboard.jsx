import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Users, ShoppingBag, DollarSign, ShieldAlert, ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '', category: 'Mobiles', price: '', old_price: '', img: '', rating: '4.5', reviews: '100', in_stock: true, description: ''
  });
  const [productSuccess, setProductSuccess] = useState('');

  // Access Denied shield removed for easy demonstration

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userId = currentUser ? currentUser.id : 1; // Fallback to user 1 for demo
        
        // Fetch stats
        const statsRes = await fetch(`/api/admin/stats?user_id=${userId}`);
        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch users
        const usersRes = await fetch(`/api/admin/users?user_id=${userId}`);
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const usersData = await usersRes.json();
        setUsers(usersData);
        
        // Fetch orders
        const ordersRes = await fetch(`/api/admin/orders?user_id=${userId}`);
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [currentUser]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductSuccess('');
    setError('');
    
    try {
      const userId = currentUser ? currentUser.id : 1;
      const resp = await fetch(`/api/admin/products?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          old_price: productForm.old_price ? Number(productForm.old_price) : null,
          rating: Number(productForm.rating),
          reviews: Number(productForm.reviews),
        })
      });
      
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Failed to create product');
      
      setProductSuccess(`Successfully created product: ${data.name}`);
      setProductForm({ name: '', category: 'Mobiles', price: '', old_price: '', img: '', rating: '4.5', reviews: '100', in_stock: true, description: '' });
      
      // Refresh stats
      const statsRes = await fetch(`/api/admin/stats?user_id=${userId}`);
      if (statsRes.ok) setStats(await statsRes.json());
      
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Data...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#111', margin: '0 0 10px 0' }}>Admin Control Panel</h1>
            <p style={{ margin: 0, color: '#666' }}>Welcome back, Owner. Here is what's happening today.</p>
          </div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', color: '#333', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <ArrowLeft size={18} /> Exit Admin Area
          </Link>
        </div>

        {error && <div style={{ padding: '15px', background: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        {/* Top Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <StatCard title="Total Users" value={stats?.users || 0} icon={Users} color="#4caf50" bg="#e8f5e9" />
          <StatCard title="Products Catalog" value={stats?.products || 0} icon={ShoppingBag} color="#2196f3" bg="#e3f2fd" />
          <StatCard title="Total Orders" value={stats?.orders || 0} icon={Activity} color="#ff9800" bg="#fff3e0" />
          <StatCard title="Total Revenue" value={`₹${(stats?.revenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} color="#e91e63" bg="#fce4ec" />
        </div>

        {/* Main Content Area */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '20px', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Registered Platform Users</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f9f9f9' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Wallet Balance</th>
                  <th style={thStyle}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>#{u.id}</td>
                    <td style={tdStyle}><strong>{u.name}</strong></td>
                    <td style={tdStyle}>{u.email || '-'}</td>
                    <td style={tdStyle}>{u.phone || '-'}</td>
                    <td style={tdStyle}>₹{(u.pay_zone_balance || 0).toLocaleString('en-IN')}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: u.is_admin ? '#e3f2fd' : '#f5f5f5', color: u.is_admin ? '#1976d2' : '#666' }}>
                        {u.is_admin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Content Area */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '20px', overflow: 'hidden', marginTop: '30px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Recent Platform Orders</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f9f9f9' }}>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Items</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Payment</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}><strong>{o.id}</strong></td>
                    <td style={tdStyle}>
                      <div>{o.user.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{o.user.email}</div>
                    </td>
                    <td style={tdStyle}>{new Date(o.date).toLocaleDateString()}</td>
                    <td style={tdStyle}>{o.items_count} items</td>
                    <td style={tdStyle}><strong>₹{o.total.toLocaleString('en-IN')}</strong></td>
                    <td style={tdStyle}>
                      <div>{o.payment_method}</div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: o.payment_status === 'Paid' ? '#2e7d32' : '#f57c00' }}>{o.payment_status}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: '#e8f5e9', color: '#2e7d32' }}>
                        {o.status || 'Processing'}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No orders placed yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Product Form */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '30px', overflow: 'hidden', marginTop: '30px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Create New Product</h2>
          
          {productSuccess && <div style={{ padding: '15px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', marginBottom: '20px' }}>{productSuccess}</div>}

          <form onSubmit={handleProductSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Product Name</label>
              <input type="text" style={inputStyle} required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
            </div>
            
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                <option value="Mobiles">Mobiles</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Grocery">Grocery</option>
                <option value="Home">Home</option>
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Image URL</label>
              <input type="text" style={inputStyle} required placeholder="https://example.com/image.jpg" value={productForm.img} onChange={e => setProductForm({...productForm, img: e.target.value})} />
            </div>

            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input type="number" style={inputStyle} required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
            </div>
            
            <div>
              <label style={labelStyle}>Old Price (₹) - Optional</label>
              <input type="number" style={inputStyle} value={productForm.old_price} onChange={e => setProductForm({...productForm, old_price: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{...inputStyle, height: '100px'}} required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}></textarea>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" style={{ background: '#2196f3', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                + Add Product to Database
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: `5px solid ${color}` }}>
    <div>
      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: '28px', color: '#222' }}>{value}</h3>
    </div>
    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={28} color={color} />
    </div>
  </div>
);

const thStyle = { padding: '15px', fontWeight: 'bold', color: '#555', fontSize: '14px', textTransform: 'uppercase' };
const tdStyle = { padding: '15px', color: '#333', fontSize: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box' };

export default AdminDashboard;
