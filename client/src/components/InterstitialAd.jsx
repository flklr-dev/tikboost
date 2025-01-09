import { useEffect } from 'react';

const InterstitialAd = ({ onClose }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }

    // Auto close after ad display
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-4442939390084208"
             data-ad-slot="8550348986"
             data-ad-format="auto"
             data-full-width-responsive="true">
        </ins>
      </div>
    </div>
  );
};

export default InterstitialAd; 