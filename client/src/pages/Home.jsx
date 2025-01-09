import { useState } from 'react';
import BoostForm from '../components/BoostForm';
import AdBanner from '../components/AdBanner';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Top Banner Ad */}
      <AdBanner position="top" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          TikTok Views Booster
        </h1>
        
        <div className="max-w-md mx-auto">
          <BoostForm />
        </div>
      </div>
      
      {/* Bottom Banner Ad */}
      <AdBanner position="bottom" />
    </div>
  );
};

export default Home; 