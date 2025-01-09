import { useState } from 'react';
import { Link } from 'react-router-dom';
import BoostForm from '../components/BoostForm';
import AdBanner from '../components/AdBanner';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* Top Banner Ad */}
      <AdBanner position="top" />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          TikTok Views Booster
        </h1>
        
        <div className="max-w-md mx-auto">
          <BoostForm />
        </div>
      </div>
      
      {/* Footer with Terms and Privacy Links */}
      <footer className="py-4 border-t border-gray-700">
        <div className="container mx-auto px-4 flex justify-center space-x-6">
          <Link 
            to="/terms" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link 
            to="/privacy" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>

      {/* Bottom Banner Ad */}
      <AdBanner position="bottom" />
    </div>
  );
};

export default Home; 