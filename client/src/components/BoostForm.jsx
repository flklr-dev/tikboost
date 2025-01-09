import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Timer from './Timer';
import InterstitialAd from './InterstitialAd';
import axios from 'axios';

const BoostForm = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [error, setError] = useState('');

  const validateTikTokUrl = (url) => {
    return url.includes('tiktok.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isVerified) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }

    if (!validateTikTokUrl(videoUrl)) {
      setError('Please enter a valid TikTok URL');
      return;
    }

    setIsLoading(true);
    
    try {
      // Show ad before boosting
      setShowAd(true);
      
      // The actual API call will happen after the ad is closed
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAdClose = async () => {
    setShowAd(false);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/boost`, {
        videoUrl
      });

      if (response.data.success) {
        setShowTimer(true);
        setVideoUrl('');
        setIsVerified(false);
      }
    } catch (error) {
      setError('Failed to boost views. Please try again.');
    }
    
    setIsLoading(false);
  };

  const onCaptchaChange = (value) => {
    setIsVerified(!!value);
    setError('');
  };

  if (showTimer) {
    return <Timer onComplete={() => setShowTimer(false)} />;
  }

  if (showAd) {
    return <InterstitialAd onClose={handleAdClose} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            TikTok Video URL
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.tiktok.com/@user/video/..."
            required
          />
        </div>

        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={onCaptchaChange}
            theme="light"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !videoUrl}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Processing...' : 'Boost Views (1000)'}
        </button>
      </form>
    </div>
  );
};

export default BoostForm; 