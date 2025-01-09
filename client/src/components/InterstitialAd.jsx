import { useEffect } from 'react';

const InterstitialAd = ({ onClose }) => {
  useEffect(() => {
    // Simulate ad display time
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Advertisement</h3>
          {/* Replace this with your actual ad code */}
          <div className="bg-gray-200 h-[300px] flex items-center justify-center">
            <span className="text-gray-500">Ad Content</span>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Your views will be processed after the ad...
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd; 