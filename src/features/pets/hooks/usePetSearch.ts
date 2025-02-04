import { useParams, useSearchParams } from "react-router-dom";
import { petsApi } from "../api/pets";

export function usePetSearch() {
  const { type = "dogs" } = useParams<{ type?: string }>();
  const [searchParams] = useSearchParams();

  const queryKey = ["pets", type, searchParams.toString()];

  const queryFn = async ({ pageParam = "0" }) => {
    const searchResult = await petsApi.searchPets({
      type,
      pageParam,
      sort: searchParams.get("sort") || "breed:asc",
      breeds: searchParams.get("breed")
        ? [searchParams.get("breed")!]
        : undefined,
      ageMin: searchParams.get("ageMin")
        ? Number(searchParams.get("ageMin"))
        : undefined,
      ageMax: searchParams.get("ageMax")
        ? Number(searchParams.get("ageMax"))
        : undefined,
    });

    const pets = await petsApi.getPetsByIds(type, searchResult.resultIds);
    return {
      pets,
      nextCursor: searchResult.next
        ? String(Number(pageParam) + 25)
        : undefined,
    };
  };

  return {
    queryKey,
    queryFn,
    enabled: true,
  };
}
