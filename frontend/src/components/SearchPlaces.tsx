import { useState } from 'react';
import { searchDestinations } from '../services/travelService';
import type { Destination } from '../types/destination';
import { useNavigate } from 'react-router-dom';
import {addDestinationToWishlist} from '../services/AddDestination';
import Navbar from './Navbar';

export default function SearchPlaces() {
  const [query, setQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlistMessages, setWishlistMessages] = useState<{[key: number]: string}>({});
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

  const handleAddToWishlist = async (destinationId: number, destinationName: string) => {
    try {
      setWishlistMessages(prev => ({ ...prev, [destinationId]: 'Adding...' }));
      
      await addDestinationToWishlist(destinationName);
      
      setWishlistMessages(prev => ({ 
        ...prev, 
        [destinationId]: 'Added to wishlist!' 
      }));
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setWishlistMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[destinationId];
          return newMessages;
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setWishlistMessages(prev => ({ 
        ...prev, 
        [destinationId]: 'Failed to add to wishlist' 
      }));
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setWishlistMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[destinationId];
          return newMessages;
        });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
       
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Your Perfect Destination
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find travel destinations tailored to your preferences with our AI-powered search
          </p>
        </section>

       
        <section className="mb-12">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setError(null);
                  }}
                  placeholder="Search for cities, countries, or landmarks..."
                  className={`w-full px-5 py-3 rounded-lg border focus:outline-none focus:ring-2 text-gray-700 ${
                    error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'
                  }`}
                  disabled={isLoading}
                  aria-label="Search destinations"
                />
                {error && (
                  <p className="absolute -bottom-6 left-0 text-red-500 text-sm mt-1">
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-400 hover:bg-blue-500 hover:scale-105 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </span>
                )}
              </button>
            </div>
          </form>
        </section>

       
        <section>
          {destinations.length > 0 ? (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Recommended Destinations
                <span className="block text-sm font-normal text-gray-500 mt-1">
                  Based on your search criteria
                </span>
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {destinations.map((destination) => (
                  <div 
                    key={destination.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900">
                            {destination.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {destination.country}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {Math.round(destination.ai_similarity * 100)}% Match
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 italic">
                        "{destination.details}"
                      </p>
                      
                      <button 
                        onClick={() => navigate(`/destination/${destination.id}`)}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        View Destination Details
                      </button>

                      <button
                        onClick={() => handleAddToWishlist(destination.id, destination.name)}
                        disabled={!!wishlistMessages[destination.id]}
                        className={`mt-3 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                          wishlistMessages[destination.id]
                            ? wishlistMessages[destination.id].includes('Added')
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : wishlistMessages[destination.id].includes('Failed')
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                            : 'text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {wishlistMessages[destination.id] || 'Save to Wishlist'}
                        </span>
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !isLoading && !error && (
              <div className="text-center py-12">
                <div className="mx-auto max-w-md">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No search yet</h3>
                  <p className="mt-1 text-gray-500">
                    Enter a destination above to discover amazing travel recommendations.
                  </p>
                </div>
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}