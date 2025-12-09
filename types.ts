// Open-Meteo API Response
export interface WeatherData {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    wind_speed_10m: number;
  };
}

// REST Countries API Response (Simplified)
export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string; // Country Code
  latlng: [number, number];
  flags: {
    png: string;
    svg: string;
  };
  capital?: string[];
  capitalInfo?: {
    latlng?: [number, number];
  };
}

// For UI Selection
export interface LocationOption {
  name: string;
  subLabel?: string;
  lat: number;
  lng: number;
  flag: string;
}