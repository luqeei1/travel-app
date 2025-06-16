// DestinationDetail.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Destination } from '../types/destination';
import { useNavigate } from 'react-router-dom';
import { AiFillStar } from "react-icons/ai";
import snow from '/images/snow.jpeg';
import sun from '/images/sun.png';


import ImageCarousel from './ImageCarousel';

const images = [
  snow,
  sun,
];

export default function DestinationDetails() {
  const isLoading = false; // Placeholder for loading state, can be replaced with actual logic
  const { id } = useParams<{ id: string }>();
  console.log('DestinationDetails id:', id);
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {

      try {
        if (!id) throw new Error('No ID provided');
        const numId = Number(id);
        if (isNaN(numId)) throw new Error('Invalid ID format');
        
        const response = await fetch(`http://localhost:8000/travel/${numId}`);
        if (!response.ok) throw new Error('Destination not found');
        
        const data: Destination = await response.json();
        setDestination(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  console.log('DestinationDetails destination:', destination);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

return (
  <div className="max-w-4xl mx-auto p-6">
    <div>
    {/* Back button */}
    <button
          type="button"
          disabled={isLoading}
          onClick ={() => navigate(-1)}
          className={`px-4 py-2 rounded-lg transition-all ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 text-white transform hover:scale-105'
          }`}
        >
         ← Back to Results
        </button>
    <div className='font-bold text-2xl mt-4 italic'>
    <h1 className='text-right'>{destination?.name}</h1>
    </div>
    </div>
        
    <div className="flex items-center mt-4">
      <AiFillStar />
      <AiFillStar />
      <AiFillStar />
      <AiFillStar />
      <AiFillStar /> 
      temporary - replace with actual rating
    </div>

    

    <span className="text-gray-700"> 4.5/5</span>
    {destination && (
      <>
        <div className="mt-6 space-y-4">
          <p className="text-xl">
            <span className="font-semibold">Average Price:</span>
            {destination
              ? ` $${destination.average_price.toFixed(2)}/night`
            : ' Not available'}
        </p>
            <p className="text-black-700">
              <span className=" italic">{destination.details}</span>
            </p>
            <p className='text-gray-700'>
              <span className="font-semibold">Country:</span> {destination.country}
            </p>
            </div>
            </>
        )}

        <ImageCarousel images={images} altText="Reykjavik view" />
        
    </div>

    
);
}