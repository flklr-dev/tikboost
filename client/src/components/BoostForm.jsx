import { useState } from 'react';

const BoostForm = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  // Determine API URL based on environment
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://tikboost.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      console.log('Making request to:', `${API_URL}/api/boost`); // Debug log

      const response = await fetch(`${API_URL}/api/boost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl })
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        setSuccess(true);
        setVideoUrl('');
        setCooldown(180);
      } else {
        setError(data.message || 'Failed to boost views');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter TikTok video URL"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading || cooldown > 0}
        />

        {cooldown > 0 && (
          <div className="text-center text-gray-600 mt-4">
            Next boost available in: {Math.floor(cooldown / 60)}:{(cooldown % 60).toString().padStart(2, '0')}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !videoUrl || cooldown > 0}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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