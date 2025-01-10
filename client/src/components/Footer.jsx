import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} TikTok Views Booster. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <Link 
              to="/terms" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              to="/privacy" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 