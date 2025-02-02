export interface Pet {
  id: string;
  img: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
}

export interface PetCardProps extends Pet {
  isFavorite?: boolean;
  onFavorite?: () => void;
}

export interface PageResult {
  pets: Pet[];
  nextCursor: string | undefined;
}
