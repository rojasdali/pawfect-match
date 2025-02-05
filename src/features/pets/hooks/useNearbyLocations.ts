import { useQuery } from "@tanstack/react-query";
import { getUserLocation, calculateBoundingBox } from "../utils/location";
import { petsApi } from "../api/pets";

export function useNearbyLocations(radiusInMiles: number = 25) {
  return useQuery({
    queryKey: ["nearbyLocations", radiusInMiles],
    queryFn: async () => {
      try {
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;

        const boundingBox = calculateBoundingBox(
          latitude,
          longitude,
          radiusInMiles
        );

        console.log("Searching locations with bounding box:", boundingBox);

        const response = await petsApi.searchLocations({
          geoBoundingBox: boundingBox,
          size: 100,
        });

        console.log("Location search response:", response);

        return response.results.map((location) => location.zip_code);
      } catch (error) {
        console.error("Error getting nearby locations:", error);
        throw error;
      }
    },
    enabled: false, // Don't run automatically
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once on failure
  });
}
