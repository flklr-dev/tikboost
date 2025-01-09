import { useState, useEffect } from 'react';

const Timer = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Next boost available in:
      </h2>
      <div className="text-4xl font-bold text-blue-600">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      <p className="mt-4 text-gray-600">
        Please wait before boosting another video
      </p>
    </div>
  );
};

export default Timer; 