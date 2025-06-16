
import type{ Destination } from '../types/destination';

export const searchDestinations = async (query: string): Promise<Destination[]> => {
  const response = await fetch('http://localhost:8000/travel/ai-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k: 5 }),
  });

  if (!response.ok) throw new Error('Failed to fetch');
  
  const data = await response.json() as Destination[];
  console.log('Search results:', data);
  return data;
}; 