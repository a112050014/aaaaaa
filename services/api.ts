import { Country, WeatherData } from '../types';

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const COUNTRIES_API_URL = "https://restcountries.com/v3.1";

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    // Fetching all countries to allow client-side filtering (better UX for dropdowns)
    // Added 'capitalInfo' to fields to get precise city coordinates
    const response = await fetch(`${COUNTRIES_API_URL}/all?fields=name,latlng,cca2,flags,capital,capitalInfo`);
    if (!response.ok) throw new Error("Failed to fetch countries");
    return await response.json();
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const fetchWeather = async (lat: number, lng: number): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m",
  });

  try {
    const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};