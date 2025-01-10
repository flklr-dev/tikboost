import { useEffect } from 'react';

const AdBanner = ({ position }) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <div className={`w-full ${position === 'top' ? 'mb-4' : 'mt-4'} min-h-[100px] overflow-hidden`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-4442939390084208"
        data-ad-slot="8550348986"
      />
    </div>
  );
};

export default AdBanner; 