import { type Filters } from "../schemas/filters";
import { type QuickFilterType } from "@/features/pets/types/index";
import { useSearchParams } from "react-router-dom";
import { getUserLocation } from "../utils/location";
import { petsApi } from "../api/pets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const nearbyLocationMutation = useMutation({
    mutationFn: async () => {
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

      if (response.results.length === 0) {
        throw new Error("No nearby locations found");
      }

      const nearest = response.results[0];
      return {
        city: nearest.city,
        state: nearest.state,
        zip_code: nearest.zip_code,
        display: `${nearest.city}, ${nearest.state} ${nearest.zip_code}`,
        latitude: Number(nearest.latitude),
        longitude: Number(nearest.longitude),
      };
    },
    onSuccess: (location) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("location", JSON.stringify(location));
      newParams.set("distance", "25");
      setSearchParams(newParams);
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: (error) => {
      console.error("Error getting location:", error);
    },
  });

  const getDefaults = (): Filters => {
    const locationParam = searchParams.get("location");
    let location = null;
    if (locationParam) {
      try {
        location = JSON.parse(locationParam);
        if (location) {
          location.latitude = Number(location.latitude);
          location.longitude = Number(location.longitude);
        }
      } catch (e) {
        console.error("Failed to parse location from URL", e);
      }
    }

    return {
      breed: searchParams.get("breed") ?? "all",
      minAge: searchParams.get("ageMin") ?? "",
      maxAge: searchParams.get("ageMax") ?? "",
      distance: searchParams.get("distance")
        ? Number(searchParams.get("distance"))
        : null,
      location,
    };
  };

  const applyFilters = (values: Filters) => {
    const newParams = new URLSearchParams(searchParams);

    if (values.minAge) {
      newParams.set("ageMin", values.minAge);
    } else {
      newParams.delete("ageMin");
    }

    if (values.maxAge) {
      newParams.set("ageMax", values.maxAge);
    } else {
      newParams.delete("ageMax");
    }

    if (values.breed === "all") {
      newParams.delete("breed");
    } else {
      newParams.set("breed", values.breed);
    }

    if (values.location) {
      const locationWithCoords = {
        ...values.location,
        latitude: Number(values.location.latitude),
        longitude: Number(values.location.longitude),
      };
      newParams.set("location", JSON.stringify(locationWithCoords));

      if (values.distance === null) {
        newParams.set("distance", "25");
      } else {
        newParams.set("distance", String(values.distance));
      }
    } else {
      newParams.delete("location");
      newParams.delete("distance");
    }

    setSearchParams(newParams);
  };

  const removeFilter = (key: string | string[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (Array.isArray(key)) {
      key.forEach((k) => {
        if (k === "sort") {
          newParams.set("sort", "breed:asc");
        } else {
          newParams.delete(k);
          if (k === "location") {
            newParams.delete("distance");
          }
        }
      });
    } else {
      if (key === "sort") {
        newParams.set("sort", "breed:asc");
      } else {
        newParams.delete(key);
        if (key === "location") {
          newParams.delete("distance");
        }
      }
    }
    setSearchParams(newParams);
  };

  const applyQuickFilter = async (type: QuickFilterType, breeds?: string[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (type === "nearby") {
      nearbyLocationMutation.mutate();
    } else if (type === "puppy") {
      newParams.set("ageMin", "0");
      newParams.set("ageMax", "2");
      setSearchParams(newParams);
    } else if (type === "senior") {
      newParams.set("ageMin", "7");
      newParams.delete("ageMax");
      setSearchParams(newParams);
    } else if (type === "random" && breeds?.length) {
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
      newParams.set("breed", randomBreed);
      setSearchParams(newParams);
    }
  };

  return {
    getDefaults,
    applyFilters,
    removeFilter,
    applyQuickFilter,
    searchParams,
    setSearchParams,
    isLoadingLocation: nearbyLocationMutation.isPending,
  };
}
