import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../api/pets";
import { type LocationSuggestion } from "./useLocationSearch";

export function useNearbyLocations(
  radiusInMiles: number = 25,
  location?: LocationSuggestion | null
) {
  return useQuery({
    queryKey: ["nearbyLocations", radiusInMiles, location?.zip_code],
    queryFn: async () => {
      try {
        if (!location) {
          throw new Error("No location provided");
        }

        if (
          typeof location.latitude !== "number" ||
          typeof location.longitude !== "number"
        ) {
          throw new Error("Invalid coordinates provided");
        }

        if (radiusInMiles === 0) {
          return [location.zip_code];
        }

        const offset = (radiusInMiles / 70) * 0.1;

        const boundingBox = {
          bottom_left: {
            lat: location.latitude - offset,
            lon: location.longitude - offset,
          },
          top_right: {
            lat: location.latitude + offset,
            lon: location.longitude + offset,
          },
        };

        const response = await petsApi.searchLocations({
          geoBoundingBox: boundingBox,
          size: 100,
        });

        return response.results.map((loc) => loc.zip_code);
      } catch (error) {
        console.error("Error getting nearby locations:", error);
        throw error;
      }
    },
    enabled: false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
