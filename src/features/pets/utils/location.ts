const MILES_TO_LAT = 0.0144927536231884; // approximately 1 mile in latitude degrees
const MILES_TO_LON = 0.0181818181818182; // approximately 1 mile in longitude degrees at 40° latitude

export function calculateBoundingBox(
  latitude: number,
  longitude: number,
  radiusInMiles: number
) {
  const latDelta = radiusInMiles * MILES_TO_LAT;
  const lonDelta = radiusInMiles * MILES_TO_LON;

  return {
    bottom_left: {
      lat: latitude - latDelta,
      lon: longitude - lonDelta,
    },
    top_right: {
      lat: latitude + latDelta,
      lon: longitude + lonDelta,
    },
  };
}

export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
}
