export interface Suggestion {
  formatted: string;
  lat: number;
  lon: number;
}

export interface OpenCageResponse {
  results: {
    formatted: string;
    geometry: {
      lat: number;
      lng: number;
    };
  }[];
}
