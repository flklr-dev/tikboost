import { useState, useEffect } from 'react';
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
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const validateTikTokUrl = (url) => {
    return url.includes('tiktok.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    if (!isVerified) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }

    if (!validateTikTokUrl(videoUrl)) {
      setError('Please enter a valid TikTok URL');
      return;
    }

    try {
      console.log('Making request to:', API_URL);
      const response = await axios.post(`${API_URL}/api/boost`, {
        videoUrl
      });

      if (response.data.success) {
        setSuccess(true);
        setVideoUrl('');
        setCooldown(180);
      }
    } catch (error) {
      console.error('Error details:', error);
      if (error.response?.status === 429) {
        setError(error.response.data.message);
        setCooldown(error.response.data.timeLeft || 180);
      } else {
        setError(error.response?.data?.message || 'Failed to boost views. Please try again.');
      }
    } finally {
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

        {cooldown > 0 && (
          <div className="text-center text-gray-600 mt-4">
            Next boost available in: {Math.floor(cooldown / 60)}:{(cooldown % 60).toString().padStart(2, '0')}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !videoUrl || cooldown > 0}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Processing...' : cooldown > 0 ? 'Please Wait' : 'Boost Views (1000)'}
        </button>

        {error && (
          <div className="text-red-500 text-sm text-center mt-4">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm text-center mt-4">
            Views boost initiated successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default BoostForm; 