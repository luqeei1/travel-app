import React from 'react'
import { MapContainer } from 'react-leaflet'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import 'leaflet/dist/leaflet.css'
import { button } from 'framer-motion/client'
import Navbar from './Navbar'
import { Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react'


function GeocodeControl({ query }: { query: string }) {
  const map = useMap();

  React.useEffect(() => {
    if (!query) return;

    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          map.setView([parseFloat(lat), parseFloat(lon)], 13);
        } else {
          alert('Location not found');
        }
      } catch (err) {
        console.error(err);
        alert('Error fetching location');
      }
    };

    fetchCoords();
  }, [query, map]);

  return null;
}


const Map = () => {

  const [input, setInput] = useState('');
  const[dest, setDest] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError('Failed to fetch destinations. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  

    

    const [search, setSearch] = React.useState('');
    const [query, setQuery] = React.useState('');
    const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
  };

   

  return (

    <>
    <div className="flex flex-wrap gap-2 ml-1 bg-blue-200">
        <Navbar />
      <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2 mb-4">
        <input
          type="text"
          className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          placeholder="Search for a location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          Go
        </button>
      </form>
      </div>
      <MapContainer
  center={[51.505, -0.09]}
  zoom={5}
  style={{ height: '1000px', width: '100%' }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />

  <div className='bg-blue-100' style={{
    position: 'absolute',
    height: '300px',
    width: '300px',
    top: '100px',
    left: '20px',
    zIndex: 1000,
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  }}>
    <div className='flex items-center justify-between w-full'>
      <h1 className='text-lg font-bold underline'> Distance </h1>
      <div className=''>
      <button className='text-lg '> ↩ </button> 
      </div>
    </div>
    

  <form onSubmit={handleSubmit}> 
    <input
      className='translate-y-[50px] h-[25px] w-full block mb-2 text-sm font-medium text-black-900 dark:text-black before:content-[ ]'
      type='text'
      value={input}
      placeholder='please enter your location'
      onChange={(e) => {
                  setInput(e.target.value);
              setError(null); 
      }}


    
    > 
    </input>

    <input
      className='translate-y-[50px] h-[25px] w-full block mb-2 text-sm font-medium text-black-900 dark:text-black before:content-[ ]'
      type='text'
      value={dest}
      placeholder='please enter your destination'
      onChange={(e) => {
                  setDest(e.target.value);
              setError(null); 
      }}


    
    > 
    </input>

  </form>

  </div>  


   <GeocodeControl query={query} />
</MapContainer>
</>

  )
}


export default Map
