
import type{ Destination } from '../types/destination';

export const searchDestinations = async (query: string): Promise<Destination[]> => {
  const response = await fetch('http://localhost:8000/travel/ai-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k: 3 }),
  });

  if (!response.ok) throw new Error('Failed to fetch');
  
  const data = await response.json() as Destination[];
  console.log('Search results:', data);
  return data;
}; 

export const getWishlist = async (): Promise<string[]> => {
  const response = await fetch('http://localhost:8000/travel/wishlist', {
    method: 'GET',
  });

  if (!response.ok) throw new Error('Failed to fetch wishlist');

  const data = await response.json() as string[];
  console.log('Fetched wishlist:', data);
  return data;
}; 

export const deleteFromWishlist = async (destination: string): Promise<{ message: string }> => {
  const response = await fetch(`http://localhost:8000/travel/wishlist/${destination}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to delete destination from wishlist');

  const data = await response.json();
  console.log('Deleted from wishlist:', data);
  return data;
}