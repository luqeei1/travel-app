import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const isLoading = false;
  const navigate = useNavigate();
  const location = useLocation(); 

  const isActive = (path : string) => location.pathname === path; 

  return (
    <>
    <div className={`flex flex-wrap gap-2 ml-1 ${isActive("/Map") ? "bg-blue-200 " : " "}`}>
      <div className="p-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => navigate(`/`)}
          className={`px-4 py-2 rounded-lg transition-all ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 text-white transform hover:scale-105'
          }`}
        >
          Search Destinations
        </button>
      </div>

      <div className="p-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => navigate(`/Map`)}
          className={`px-4 py-2 rounded-lg transition-all ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
          }`}
        >
          View Map
        </button>
      </div>

      <div className="p-2">
        <button
          type="button"
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg transition-all ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
          }`}
        >
          Plan Trip
        </button>
      </div>
    </div>
    </>
  );
};

export default Navbar;
