const AdBanner = ({ position }) => {
  return (
    <div className={`w-full ${position === 'top' ? 'mb-4' : 'mt-4'}`}>
      {/* Replace this with your actual ad code */}
      <div className="bg-gray-200 h-[90px] flex items-center justify-center">
        <span className="text-gray-500">Advertisement</span>
      </div>
    </div>
  );
};

export default AdBanner; 