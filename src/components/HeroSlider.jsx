import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    tag: 'EXCLUSIVE',
    tagColor: '#e60023',
    title: 'Royal Ethnic\nCollection',
    desc: 'Up to 88% Off | Starting ₹398',
    btnText: 'Shop Collection',
    btnBg: 'white',
    btnColor: '#333',
    img: 'https://rukminim1.flixcart.com/image/1498/1498/xif0q/dress/f/a/h/s-agg-print-black-dungaree-dress-sadhnazon-original-imahfyfh8fuqemyd.jpeg?q=90',
    link: '/search?category=Fashion'
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    tag: 'BESTSELLER',
    tagColor: '#fb641b',
    title: 'Premium\nAudio Pro',
    desc: 'Experience Sound | Flat 40% Off',
    btnText: 'Explore Tech',
    btnBg: '#fb641b',
    btnColor: 'white',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
    link: '/search?category=Electronics'
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    tag: 'LIMITED TIME',
    tagColor: '#e60023',
    title: 'IQOO\nSmartphones',
    desc: 'Buy the moment, enjoy the memories.',
    btnText: 'View Deals',
    btnBg: '#11998e',
    btnColor: 'white',
    img: 'https://rukminim1.flixcart.com/image/1498/1498/xif0q/mobile/g/b/p/z10r-5g-i2410-iqoo-original-imahehzhtz45pthh.jpeg?q=90',
    link: '/search?category=Mobiles'
  }
];

const HeroSlider = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const moveSlide = (dir) => {
    setCurrentIdx((prevIdx) => (prevIdx + dir + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className="premium-slider">
      <button className="nav-arrow left" onClick={() => moveSlide(-1)}>
        <ChevronLeft size={24} />
      </button>
      <button className="nav-arrow right" onClick={() => moveSlide(1)}>
        <ChevronRight size={24} />
      </button>

      <div 
        className="slides-inner" 
        style={{ transform: `translateX(-${currentIdx * 33.333}%)` }}
      >
        {SLIDES.map((slide) => (
          <div className="hero-slide" key={slide.id}>
            <div className="slide-flex" style={{ background: slide.bg, color: 'white' }}>
              <div className="hero-text">
                <span className="mini-tag" style={{ background: slide.tagColor }}>{slide.tag}</span>
                <h1 style={{ whiteSpace: 'pre-line' }}>{slide.title}</h1>
                <p>{slide.desc}</p>
                <button 
                  className="action-btn" 
                  onClick={() => navigate(slide.link)}
                  style={{ background: slide.btnBg, color: slide.btnColor }}
                >
                  {slide.btnText}
                </button>
              </div>
              <div className="hero-img">
                <img src={slide.img} alt={slide.title.replace('\n', ' ')} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
