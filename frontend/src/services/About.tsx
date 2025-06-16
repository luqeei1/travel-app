import type{ Destination } from '../types/destination';

export const getDestinationDetails = async (id: number): Promise<Destination> => {
  const response = await fetch(`http://localhost:8000/travel/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to fetch destination details');
  
  const data = await response.json();
  return data;
};