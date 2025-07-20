import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { getWishlist } from '../services/travelService';
import type { Destination } from '../types/destination';
import { deleteFromWishlist } from '../services/travelService';

const WishList = () => {
  const [data, setData] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        const mongofetch = await getWishlist();
        setData(mongofetch || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch wishlist');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const deleteItem = async (item: string) => {
    try {
      await deleteFromWishlist(item);
      setData(prevData => prevData.filter(d => d !== item));
    }
    catch (error) {
      console.error('Error deleting item from wishlist:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete item');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wish List</h1>
        <p className="text-lg text-gray-600 mb-6">Here you can manage your saved destinations.</p>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-gray-600">Loading wishlist...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Your wishlist is empty. Start adding destinations!</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center space-x-4 ">
                  <div className="text-blue-500 text-2xl"> </div>
                  <div className="text-lg font-semibold text-gray-800">{item}</div>
                  <div className='flex flex-cols items-end justify-end w-full'>
                    <button
                      className="ml-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                      onClick={() => deleteItem(item)}>
                      Delete
                    </button>
                  </div> 
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
