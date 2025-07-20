import type { Destination } from '../types/destination';

export const addDestination = async (name : string) : Promise<Destination> => {
    const response = await fetch('http://localhost:8000/travel/add', {
        method : 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
            name: name,
        }),
    });
    if (!response.ok) throw new Error('Failed to add');
    const data = await response.json();
    console.log('Added destination:', data);
    return data;
}

export const addDestinationToMongoDB = async (destination: string): Promise<{ message: string }> => {
    const response = await fetch('http://localhost:8000/travel/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: destination }),
    });

    if (!response.ok) throw new Error('Failed to add destination to MongoDB');

    
    const data = await response.json();
    return data;
}

export const addDestinationToWishlist = async (destination: string): Promise<{ message: string }> => {
    const response = await fetch(`http://localhost:8000/travel/wishlist/${destination}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to add destination to wishlist');

    const data = await response.json();
    return data;
}
