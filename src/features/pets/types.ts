export type Pet = {
  id: string;
  name: string;
  breed: string;
  age: number;
  img: string;
  zip_code: string;
};

export type LocationSuggestion = {
  city: string;
  state: string;
  zip_code: string;
  display: string;
  latitude: number;
  longitude: number;
};

export type LocationSearchParams = {
  query?: string;
  size?: number;
  geoBoundingBox?: {
    bottom_left: {
      lat: number;
      lon: number;
    };
    top_right: {
      lat: number;
      lon: number;
    };
  };
};

export type Filters = {
  location: LocationSuggestion | null;
  distance: number | null;
  breed: string | null;
  age: string | null;
  size: string | null;
  gender: string | null;
  sort: string | null;
};
