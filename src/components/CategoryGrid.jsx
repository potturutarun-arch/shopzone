import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, Monitor, Home, Baby, Plus, Smartphone, Utensils, Tv, Sparkles, Armchair, Dumbbell, Wallet } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: "Fashion", Icon: Shirt, color: "#e91e63", bg: "#fce4ec" },
  { id: 2, name: "Electronics", Icon: Monitor, color: "#2196f3", bg: "#e3f2fd" },
  { id: 3, name: "Home", Icon: Home, color: "#4caf50", bg: "#e8f5e9" },
  { id: 4, name: "Toys & Baby", Icon: Baby, color: "#ff9800", bg: "#fff3e0" },
  { id: 5, name: "Plus", Icon: Plus, color: "#9c27b0", bg: "#f3e5f5" },
  { id: 6, name: "Mobiles", Icon: Smartphone, color: "#3f51b5", bg: "#e8eaf6" },
  { id: 7, name: "Food", Icon: Utensils, color: "#f44336", bg: "#ffebee" },
  { id: 8, name: "Appliances", Icon: Tv, color: "#00bcd4", bg: "#e0f7fa" },
  { id: 9, name: "Beauty", Icon: Sparkles, color: "#e040fb", bg: "#f3e5f5" },
  { id: 10, name: "Furniture", Icon: Armchair, color: "#795548", bg: "#efebe9" },
  { id: 11, name: "Sports", Icon: Dumbbell, color: "#ff5722", bg: "#fbe9e7" }
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="category-section" style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', margin: '20px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '20px', justifyContent: 'center' }}>
        {CATEGORIES.map(cat => {
          const IconComponent = cat.Icon;
          return (
            <button 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '12px',
                transition: 'transform 0.2s, background 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = '#f9f9f9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.background = 'none';
              }}
            >
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: cat.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
              }}>
                <IconComponent size={28} color={cat.color} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444', textAlign: 'center' }}>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
