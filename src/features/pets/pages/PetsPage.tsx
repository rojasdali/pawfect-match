import { PetCard } from "../components/PetCard";
import { Navbar } from "@/components/layout/Navbar";

// Mock data for testing
const mockPets = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: 3,
    type: "dog" as const,
    img: "https://images.dog.ceo/breeds/pinscher-miniature/n02107312_1207.jpg",
  },
  {
    id: 2,
    name: "Luna",
    breed: "Siberian Husky",
    age: 2,
    type: "dog" as const,
    img: "https://images.dog.ceo/breeds/husky/n02110185_1469.jpg",
  },
  {
    id: 3,
    name: "Max",
    breed: "German Shepherd",
    age: 4,
    type: "dog" as const,
    img: "https://images.dog.ceo/breeds/newfoundland/n02111277_8856.jpg",
  },
  {
    id: 4,
    name: "Bella",
    breed: "Labrador",
    age: 1,
    type: "dog" as const,
    img: "https://images.dog.ceo/breeds/cavapoo/doggo2.jpg",
  },
];

export function PetsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Available Pets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockPets.map((pet) => (
            <PetCard
              key={pet.id}
              {...pet}
              isFavorite={false}
              onFavorite={() => console.log("Favorite:", pet.name)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
