import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { addDestinationToMongoDB } from '../services/AddDestination';
import { Visited } from '../services/Visited';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function GeocodeControl({
  query,
  setMarkerPosition,
  onLocationFound,
}: {
  query: string;
  setMarkerPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  onLocationFound?: (name: string, coords: [number, number]) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!query) return;

    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          const position: [number, number] = [parseFloat(lat), parseFloat(lon)];
          map.setView(position, 13);
          setMarkerPosition(position);
          
          // Call the callback if provided
          if (onLocationFound) {
            onLocationFound(query, position);
          }
        } else {
          alert('Location not found');
        }
      } catch (err) {
        console.error(err);
        alert('Error fetching location');
      }
    };

    fetchCoords();
  }, [query, map, setMarkerPosition, onLocationFound]);

  return null;
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  
  return null;
}

const Map = () => {
  const [clicked, setClicked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewSaved, setViewSaved] = useState(false);

  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [savedLocationCoords, setSavedLocationCoords] = useState<{[key: string]: [number, number]}>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedMarkerPosition, setSavedMarkerPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchSavedLocations = async () => {
      try {
        const locations = await Visited();
        setSavedLocations(locations.map(dest => dest));
      } catch (err) {
        console.error('Error fetching saved locations:', err);
      }
    };

    fetchSavedLocations();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [savedLocations]);

  useEffect(() => {
    // Show the current location on the map when viewSaved is toggled or index changes
    if (viewSaved && savedLocations.length > 0 && savedLocations[currentIndex]) {
      geocodeAndShowLocation(savedLocations[currentIndex]);
    } else {
      setSavedMarkerPosition(null);
    }
  }, [viewSaved, currentIndex, savedLocations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
  };

  const handleLocationFound = (name: string, coords: [number, number]) => {
    // Store the coordinates for this location
    setSavedLocationCoords(prev => ({ ...prev, [name]: coords }));
  };

  const geocodeAndShowLocation = async (locationName: string) => {
    // Check if we already have coordinates for this location
    if (savedLocationCoords[locationName]) {
      setSavedMarkerPosition(savedLocationCoords[locationName]);
      return savedLocationCoords[locationName];
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const position: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setSavedMarkerPosition(position);
        setSavedLocationCoords(prev => ({ ...prev, [locationName]: position }));
        return position;
      }
    } catch (err) {
      console.error('Error geocoding saved location:', err);
    }
    return null;
  };

  const handleSave = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError('Please enter a location name');
      return;
    }

    setError(null);
    setIsLoading(true);
    setSuccessMessage(null);

    try {
      await addDestinationToMongoDB(trimmedInput);
      setSuccessMessage('Location saved successfully!');
      setInput('');
      setSavedLocations((prev) => [...prev, trimmedInput]);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving destination:', error);
      setError('Failed to save location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? savedLocations.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    if (savedLocations[newIndex]) {
      geocodeAndShowLocation(savedLocations[newIndex]);
    }
  };

  const handleNext = () => {
    const newIndex = currentIndex === savedLocations.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    if (savedLocations[newIndex]) {
      geocodeAndShowLocation(savedLocations[newIndex]);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Search for cities, landmarks, or addresses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {error && (
                <p className="absolute left-0 -bottom-5 text-red-500 text-xs">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markerPosition && <Marker position={markerPosition} />}
          {savedMarkerPosition && (
            <Marker 
              position={savedMarkerPosition}
              icon={L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS4xMjc0IDAgMjQuNSA1LjM3MjU4IDI0LjUgMTJDMjQuNSAxOC42Mjc0IDE5LjEyNzQgMjQgMTIuNSAyNEw2IDQxTDEyLjUgMjRDNS44NzI1OCAyNCAwLjUgMTguNjI3NCAwLjUgMTJDMC41IDUuMzcyNTggNS44NzI1OCAwIDEyLjUgMFoiIGZpbGw9IiNGRjY3MDAiLz4KPGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                shadowSize: [41, 41]
              })}
            />
          )}
          <GeocodeControl 
            query={query} 
            setMarkerPosition={setMarkerPosition} 
            onLocationFound={handleLocationFound}
          />
          <MapController center={savedMarkerPosition} />

          <motion.div
            className="bg-white absolute top-4 right-0 z-[1000] p-4 rounded-lg shadow-lg border border-gray-200"
            initial={{ x: 0 }}
            animate={{ x: clicked ? 'calc(100% - 48px)' : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-3">
              <motion.button
                onClick={() => setClicked(!clicked)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 hover:text-gray-800 text-lg"
              >
                {clicked ? '←' : '→'}
              </motion.button>

              <h2 className="text-lg mx-4 font-semibold text-gray-800">Save Visited Location</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                type="text"
                value={input}
                placeholder="Enter location name"
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                  setSuccessMessage(null);
                }}
                disabled={isLoading}
              />

              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}

              {successMessage && (
                <p className="text-green-500 text-xs mt-1">{successMessage}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 text-white rounded-md transition-all ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-400 hover:bg-blue-500 hover:scale-105'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setViewSaved(!viewSaved)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {viewSaved ? 'Hide Previous' : 'Show Previous'}
                </button>
              </div>
            </form>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[1000] flex flex-col items-center justify-center">
            {viewSaved && (
              <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-[1001] flex items-center min-w-[250px]">
                <button
                  className="text-xl font-extrabold text-blue-500 mr-4 hover:scale-105"
                  onClick={handlePrev}
                  disabled={savedLocations.length === 0}
                >
                  ⇐
                </button>
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    <ul>
                      {savedLocations.length === 0 ? (
                        <li>No saved locations to show.</li>
                      ) : (
                        <li>{savedLocations[currentIndex]}</li>
                      )}
                    </ul>
                  </h3>
                </div>
                <button
                  className="text-xl font-extrabold text-blue-500 ml-4 hover:scale-105"
                  onClick={handleNext}
                  disabled={savedLocations.length === 0}
                >
                  ⇒
                </button>
              </div>
            )}
          </div>
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;