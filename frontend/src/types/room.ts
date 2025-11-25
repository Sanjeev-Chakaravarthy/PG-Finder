export interface Room {
  id: string;
  name: string;
  location: string;
  area: string;
  price: number;
  occupancy: "Single" | "Double" | "Triple";
  gender: "Male" | "Female" | "Co-ed";
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  facilities: {
    wifi: boolean;
    ac: boolean;
    food: boolean;
    laundry: boolean;
    parking: boolean;
    gym: boolean;
    cleaning: boolean;
    security: boolean;
  };
  distance: {
    metro: string;
    busStop: string;
    office: string;
  };
  description: string;
  rules: string[];
  foodMenu?: string[];
  deposit: number;
  noticePeriod: number;
}

export interface ComparisonMetrics {
  roomSize: number;
  amenitiesScore: number;
  pricing: number;
  connectivity: number;
  foodQuality: number;
  safety: number;
}
