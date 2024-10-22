import axios from "axios";
import { Suggestion, OpenCageResponse } from "../types/Geolocation";

export const fetchGeoSuggestions = async (
  query: string
): Promise<Suggestion[]> => {
  if (query.length < 3) {
    return [];
  }

  try {
    const response = await axios.get<OpenCageResponse>(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${import.meta.env.VITE_OPEN_CAGE_API_KEY}`
    );
    return response.data.results.map((result) => ({
      formatted: result.formatted,
      lat: result.geometry.lat,
      lon: result.geometry.lng,
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};
