import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Search Destinations', color: 'blue' },
    { path: '/Map', label: 'View Map', color: 'blue' },
    { path: '/Plan', label: 'Wish List', color: 'blue' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              TravelPlanner
            </h1>
            <div className="flex space-x-1 sm:space-x-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? `bg-${item.color}-100 text-${item.color}-700`
                      : `text-gray-600 hover:text-${item.color}-600 hover:bg-${item.color}-50`
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;