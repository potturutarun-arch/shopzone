import React from 'react';
import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import HistoryDisplay from '../components/HistoryDisplay';
import Suggestions from '../components/Suggestions';
import DealsCountdown from '../components/DealsCountdown';

const Home = () => {
  return (
    <main className="app-container">
      <CategoryGrid />
      <HeroSlider />
      <DealsCountdown />
      <HistoryDisplay />
      <Suggestions />
    </main>
  );
};

export default Home;
