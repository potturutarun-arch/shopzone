// Utility to generate a massive mock database of 2000 products with realistic pricing and unique imagery
const CATEGORIES = [
  "Fashion", "Electronics", "Home", "Toys & Baby", "Plus", "Mobiles", "Food", "Appliances", "Beauty", "Furniture", "Sports"
];

const ADJECTIVES = ["Premium", "Essential", "Modern", "Classic", "Smart", "Ultra", "Lite", "Pro", "Elegant", "Rugged"];

// Nouns mapped to specific pricing ranges [min, max] and distinct image URLs
const NOUN_DATA = {
  // Fashion (₹299 - ₹3,499)
  "Shirt": { bounds: [499, 1999], img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=500&q=80" },
  "Jeans": { bounds: [799, 2999], img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80" },
  "Jacket": { bounds: [1299, 3499], img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80" },
  "Sneakers": { bounds: [999, 4999], img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
  "Watch": { bounds: [499, 3999], img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80" },
  "Sundress": { bounds: [699, 2499], img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80" },
  
  // Home (₹199 - ₹4,999)
  "Lamp": { bounds: [499, 2999], img: "https://images.unsplash.com/photo-1507473885765-e6ed057f7821?w=500&q=80" },
  "Vase": { bounds: [299, 1999], img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&q=80" },
  "Rug": { bounds: [999, 8999], img: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=500&q=80" },
  "Curtains": { bounds: [499, 3499], img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=500&q=80" },

  // Toys & Baby (₹199 - ₹2,999)
  "Action Figure": { bounds: [299, 1499], img: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=500&q=80" },
  "Board Game": { bounds: [499, 2499], img: "https://images.unsplash.com/photo-1610890716171-6b1cc661e121?w=500&q=80" },
  "Puzzle": { bounds: [199, 999], img: "https://images.unsplash.com/photo-1582216508933-28f8fce1fc03?w=500&q=80" },
  "Plush Toy": { bounds: [299, 1299], img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80" },

  // Plus/Misc (Premium)
  "Member Box": { bounds: [1999, 4999], img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80" },
  "Exclusive Set": { bounds: [2999, 8999], img: "https://images.unsplash.com/photo-1620327311749-9307b22a613f?w=500&q=80" },
  
  // Electronics (₹999 - ₹19,999)
  "Headphones": { bounds: [999, 14999], img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  "Earbuds": { bounds: [899, 6999], img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80" },
  "Speaker": { bounds: [1299, 9999], img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80" },
  "Monitor": { bounds: [6999, 24999], img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
  "Keyboard": { bounds: [499, 4999], img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
  "Mouse": { bounds: [299, 2999], img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },

  // Mobiles (₹7,999 - ₹1,29,999)
  "Smartphone": { bounds: [7999, 69999], img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80" },
  "5G Phone": { bounds: [12999, 89999], img: "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=500&q=80" },
  "Foldable Phone": { bounds: [79999, 149999], img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80" },
  "Gaming Phone": { bounds: [29999, 69999], img: "https://images.unsplash.com/photo-1601633534568-15c0e1069fc6?w=500&q=80" },
  
  // Food (₹99 - ₹1,999)
  "Organic Coffee": { bounds: [299, 999], img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80" },
  "Green Tea": { bounds: [149, 599], img: "https://images.unsplash.com/photo-1627492275512-421731d17dbf?w=500&q=80" },
  "Protein Bars": { bounds: [399, 1499], img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" },
  "Mixed Nuts": { bounds: [499, 1999], img: "https://images.unsplash.com/photo-1599598425947-33002629eeaf?w=500&q=80" },

  // Appliances (₹1,499 - ₹29,999)
  "Blender": { bounds: [1499, 4999], img: "https://images.unsplash.com/photo-1585237833075-8bd4ef4cb1fe?w=500&q=80" },
  "Microwave": { bounds: [3999, 12999], img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&q=80" },
  "Air Fryer": { bounds: [4999, 9999], img: "https://images.unsplash.com/photo-1626200419188-37f00d8c105b?w=500&q=80" },
  "Coffee Maker": { bounds: [1999, 14999], img: "https://images.unsplash.com/photo-1520188740392-68beafac0162?w=500&q=80" },
  
  // Beauty (₹99 - ₹2,999)
  "Face Serum": { bounds: [399, 1999], img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80" },
  "Moisturizer": { bounds: [199, 1299], img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80" },
  "Perfume": { bounds: [499, 4999], img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80" },
  "Lipstick": { bounds: [199, 999], img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80" },
  
  // Furniture (₹1,999 - ₹49,999)
  "Sofa": { bounds: [8999, 49999], img: "https://images.unsplash.com/photo-1550254478-ead385a4dd0f?w=500&q=80" },
  "Coffee Table": { bounds: [1999, 8999], img: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500&q=80" },
  "Desk": { bounds: [1999, 12999], img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80" },
  
  // Sports (₹299 - ₹4,999)
  "Yoga Mat": { bounds: [299, 1499], img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80" },
  "Dumbbell": { bounds: [499, 4999], img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80" },
  "Football": { bounds: [399, 1999], img: "https://images.unsplash.com/photo-1614632537190-23e414c1cf60?w=500&q=80" },
  "Treadmill": { bounds: [9999, 39999], img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80" },
  "Tennis Racket": { bounds: [1499, 7999], img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80" }
};

// Groups of nouns for easy randomizing across categories
const CATEGORY_MAP = {
  "Fashion": ["Shirt", "Jeans", "Jacket", "Sneakers", "Watch", "Sundress"],
  "Electronics": ["Headphones", "Earbuds", "Speaker", "Monitor", "Keyboard", "Mouse"],
  "Home": ["Lamp", "Vase", "Rug", "Curtains"],
  "Toys & Baby": ["Action Figure", "Board Game", "Puzzle", "Plush Toy"],
  "Plus": ["Member Box", "Exclusive Set"],
  "Mobiles": ["Smartphone", "5G Phone", "Foldable Phone", "Gaming Phone"],
  "Food": ["Organic Coffee", "Green Tea", "Protein Bars", "Mixed Nuts"],
  "Appliances": ["Blender", "Microwave", "Air Fryer", "Coffee Maker"],
  "Beauty": ["Face Serum", "Moisturizer", "Perfume", "Lipstick"],
  "Furniture": ["Sofa", "Coffee Table", "Desk"],
  "Sports": ["Dumbbell", "Yoga Mat", "Treadmill", "Football", "Tennis Racket"]
};

// Default Fallback
const FALLBACK_IMG = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80";

// Helpers
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateDatabase = () => {
  const database = [];
  let idCounter = 1000;

  for (let i = 0; i < 2000; i++) {
    // Distribute products evenly across categories
    const categoryIndex = i % CATEGORIES.length;
    const category = CATEGORIES[categoryIndex];
    
    const adj = randomItem(ADJECTIVES);
    
    // Choose specific noun
    const nounArr = CATEGORY_MAP[category] || ["Accessory"];
    const noun = randomItem(nounArr);
    
    // Look up data bounds specifically for the noun
    const nounData = NOUN_DATA[noun];
    
    // Generate unique image per product using loremflickr with the noun as keyword
    let query = encodeURIComponent(noun.split(' ')[0].toLowerCase());
    
    // Inject romantic fashion themes for the Fashion category
    if (category === "Fashion") {
      query = "romantic,fashion,couple";
    }
    
    const imgUrl = `https://loremflickr.com/500/500/${query}?lock=${idCounter}`;
    
    const minPrice = nounData?.bounds?.[0] || 299;
    const maxPrice = nounData?.bounds?.[1] || 1999;

    // Generate accurate basePrice in INR
    let basePrice = randomInRange(minPrice, maxPrice);
    
    // Round to cleanest INR pricing format (e.g. 499, 999, 1499)
    basePrice = Math.floor(basePrice / 100) * 100 + 99;

    // About 40% of items are on sale, creating realistic oldPrices
    const isOnSale = Math.random() > 0.6;
    let oldPrice = null;
    if (isOnSale) {
       // Markup between 15% to 50%
       oldPrice = Math.floor(basePrice * (1 + randomInRange(15, 50)/100));
       oldPrice = Math.floor(oldPrice / 100) * 100 + 99; // Clean format again
    }

    // Rating between 3.5 and 5.0
    const rating = (randomInRange(35, 50) / 10).toFixed(1);
    const reviews = randomInRange(10, 5000);

    database.push({
      id: idCounter++,
      name: `${adj} ${noun} - Series ${randomInRange(1, 9)}`,
      category: category,
      price: basePrice,
      oldPrice: oldPrice,
      img: imgUrl,
      rating: parseFloat(rating),
      reviews: reviews,
      inStock: Math.random() > 0.08, // 92% chance to be in stock
      description: `Experience the highest quality with our ${adj.toLowerCase()} ${noun.toLowerCase()}. Built with premium materials for everyday excellence. Key features include: ${randomItem(["Durable and robust design", "Eco-friendly footprint", "High performance output", "Compact and lightweight design"])}, ${randomItem(["Multi-purpose versatile usage", "Sleek modern aesthetics", "Long-lasting premium finish", "Easy to clean and maintain"])}.`
    });
  }

  // Shuffle array using Fisher-Yates
  for (let i = database.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [database[i], database[j]] = [database[j], database[i]];
  }

  return database;
};

// Exporting a singleton instance so all components use the exact same memory array
export const ProductDB = generateDatabase();
