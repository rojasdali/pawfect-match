import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../api/pets";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { STATE_MAP } from "../utils/states";
import { getUserLocation } from "../utils/location";

export interface LocationSuggestion {
  city: string;
  state: string;
  zip_code: string;
  display: string;
  latitude: number;
  longitude: number;
}

function findStateMatch(searchTerm: string) {
  const searchLower = searchTerm.toLowerCase();

  if (searchTerm.length === 2) {
    const upperSearch = searchTerm.toUpperCase();
    if (Object.values(STATE_MAP).includes(upperSearch)) {
      return upperSearch;
    }
  }

  const stateMatch = Object.entries(STATE_MAP).find(([name]) =>
    name.toLowerCase().includes(searchLower)
  );

  return stateMatch?.[1];
}

function buildSearchParams(searchTerm: string) {
  const isZipSearch = /^\d+$/.test(searchTerm);
  const stateAbbr = findStateMatch(searchTerm);

  if (searchTerm.length < 2) {
    return { size: 25 };
  }

  if (isZipSearch) {
    return {
      size: 25,
      zipCodes: [`${searchTerm}*`],
    };
  }

  if (stateAbbr) {
    return {
      size: 25,
      states: [stateAbbr],
    };
  }

  return {
    size: 25,
    city: searchTerm.replace(/\*$/, ""),
  };
}

export function useNearestCity() {
  return useQuery({
    queryKey: ["nearestCity"],
    queryFn: async () => {
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;

      const response = await petsApi.searchLocations({
        geoBoundingBox: {
          bottom_left: {
            lat: latitude - 0.1,
            lon: longitude - 0.1,
          },
          top_right: {
            lat: latitude + 0.1,
            lon: longitude + 0.1,
          },
        },
        size: 1,
      });

      if (response.results.length > 0) {
        const nearest = response.results[0];
        return {
          city: nearest.city,
          state: nearest.state,
          zip_code: nearest.zip_code,
          display: `${nearest.city}, ${nearest.state} ${nearest.zip_code}`,
          latitude: nearest.latitude,
          longitude: nearest.longitude,
        };
      }
      return null;
    },
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLocationSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query, 300);

  return useQuery({
    queryKey: ["locationSearch", debouncedQuery],
    queryFn: async () => {
      try {
        const params = buildSearchParams(debouncedQuery);

        const response = await petsApi.searchLocations(params);

        if (!response.results.length) {
          return [];
        }

        const locations = response.results
          .filter(
            (location) =>
              location.city &&
              location.state &&
              location.zip_code &&
              typeof location.latitude === "number" &&
              typeof location.longitude === "number"
          )
          .map((location) => {
            const suggestion: LocationSuggestion = {
              city: location.city,
              state: location.state,
              zip_code: location.zip_code,
              display: `${location.city}, ${location.state} ${location.zip_code}`,
              latitude: location.latitude,
              longitude: location.longitude,
            };
            return suggestion;
          });

        const uniqueLocations = locations.filter(
          (location, index, self) =>
            index === self.findIndex((l) => l.zip_code === location.zip_code)
        );

        return uniqueLocations;
      } catch (error) {
        console.error("Error in location search:", error);
        return [];
      }
    },
    enabled: debouncedQuery.length > 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
