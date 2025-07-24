import { useState, useEffect } from 'react';
import { searchDestinations } from '../services/travelService';
import type { Destination } from '../types/destination';
import { useNavigate } from 'react-router-dom';
import { addDestinationToWishlist } from '../services/AddDestination';
import Navbar from './Navbar';

export default function SearchPlaces() {
  const [query, setQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlistMessages, setWishlistMessages] = useState<{[key: number]: string}>({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedQuery = localStorage.getItem('searchQuery');
      const savedDestinations = localStorage.getItem('searchResults');
      
      if (savedQuery) {
        setQuery(savedQuery);
      }
      
      if (savedDestinations) {
        const parsedDestinations = JSON.parse(savedDestinations);
        setDestinations(parsedDestinations);
      }
    } catch (error) {
      console.error('Error loading saved search data:', error);
      localStorage.removeItem('searchQuery');
      localStorage.removeItem('searchResults');
    }
  }, []);

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
      
      localStorage.setItem('searchQuery', trimmedQuery);
      localStorage.setItem('searchResults', JSON.stringify(results));
      
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
            Find travel destinations tailored to your preferences with our search
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
                    const newValue = e.target.value;
                    setQuery(newValue);
                    setError(null);
                    if (newValue.trim() === '') {
                      setDestinations([]);
                      localStorage.removeItem('searchQuery');
                      localStorage.removeItem('searchResults');
                    }
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
                    <span className="inline-block">Loading</span>
                  </span>
                ) : (
                  'Search'
                )}
              </button>
            </div>
            
            {destinations.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setDestinations([]);
                    setError(null);
                    localStorage.removeItem('searchQuery');
                    localStorage.removeItem('searchResults');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear Results
                </button>
              </div>
            )}
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
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 italic">
                        "{destination.details}"
                      </p>
                      
                      <button 
                        onClick={() => navigate(`/${destination.id}`)}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        View Destination Details
                      </button>

                      <button
                        onClick={() => handleAddToWishlist(destination.id, destination.name)}
                        disabled={!!wishlistMessages[destination.id]}
                        className={`mt-3 w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                          wishlistMessages[destination.id]
                            ? wishlistMessages[destination.id].includes('Added')
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : wishlistMessages[destination.id].includes('Failed')
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                            : 'text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border-gray-300'
                        }`}
                      >
                        {wishlistMessages[destination.id] || 'Save to Wishlist'}
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
                  <div className="mx-auto h-12 w-12 text-gray-400 text-4xl mb-2" />
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