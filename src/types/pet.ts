export const VALID_PET_TYPES = ["dogs"] as const;
export type PetType = (typeof VALID_PET_TYPES)[number];

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  img: string;
  zip_code: string;
}
