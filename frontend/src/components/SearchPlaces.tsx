// src/components/SearchPlaces.tsx
import { useState } from 'react';
import { searchDestinations } from '../services/travelService';
import type { Destination } from '../types/destination';
import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar';


export default function SearchPlaces() {
  const [query, setQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      setError('Please enter a destination');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchDestinations(trimmedQuery);
      setDestinations(results);
      if (results.length === 0) {
        setError('No destinations found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to fetch destinations. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white-500 p-6 mt-8">
        <div className="max-w-2xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
              setError(null); 
            }}
            placeholder="Where would you like to go?"
            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
            }`}
            disabled={isLoading}
            aria-label="Search destinations"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>

      {destinations.length > 0 ? (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-800">Top Recommendations</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {destinations.map((destination) => (
              <div 
                key={destination.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
              >

                
                
                <h3 className="font-bold text-lg text-teal-700 text-left">
                  {destination.name}
                  <p className="text-sm text-gray-500 mb-2 text-left">{destination.country}</p>
                  <div className='flex justify-start text-right mb-2'>
                  <button onClick={() => navigate(`/destination/${destination.id}`)} className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 ml-auto'>View Details</button> 
                </div>
                </h3>
                <p className="text-gray-700 line-clamp-3 text-left italic">"{destination.details}"</p>
                <p className="text-sm text-gray-500 mt-2 text-left">Destination Match: {Math.round(destination.ai_similarity * 100)}%</p>
                
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isLoading && !error && (
          <div className="text-center py-8 text-gray-500">
            <p>Enter a destination to see recommendations</p>
          </div>
        )
      )}
    </div>
    </div>
    </>
  );
}