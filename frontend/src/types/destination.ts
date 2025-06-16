// src/types/destination.ts
export interface Destination {
  id: number;
  name: string;
  country: string | "";
  details: string | "";
  ai_similarity: number | 0;
  average_price: number | 0;
}

