export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  img: string;
  zip_code: string;
}

export interface PageResult {
  pets: Pet[];
  total: number;
  nextCursor?: string;
}

export type QuickFilterType = "puppy" | "senior" | "random" | "nearby";

export interface PetCardProps extends Pet {
  isFavorite?: boolean;
  onFavorite?: () => void;
}
