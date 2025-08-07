// DestinationDetail.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


export default function DestinationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        if (!id) throw new Error('No ID provided');
        const numId = Number(id);
        if (isNaN(numId)) throw new Error('Invalid ID format');
        
        console.log('Fetching destination with ID:', numId);
        const response = await fetch(`http://localhost:8000/travel/${numId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        setDestination(data);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-gray-600">Loading destination details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="bg-red-100 border border-red-300 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {destination && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{destination.name}</h1>
              <p className="text-xl text-gray-600">{destination.country}</p>
            </div>

            
            <div className="space-y-6">
              
              

              
              {destination.average_temperature && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Average Temperature</h3>
                  <p className="text-2xl font-bold text-orange-900">
                    {destination.average_temperature}°C
                  </p>
                </div>
              )}

              
              {destination.average_weather && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Climate</h3>
                  <p className="text-2xl font-bold text-blue-900 capitalize">
                    {destination.average_weather}
                  </p>
                </div>
              )}

              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed italic">
                  "{destination.details}"
                </p>
              </div>

            </div>

            
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
              >
                Explore More Destinations
              </button>
              <button
                onClick={() => navigate('/Plan')}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700"
              >
                View My Wishlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}