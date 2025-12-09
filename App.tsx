import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import DetailsGrid from './components/DetailsGrid';
import { fetchCountries, fetchWeather } from './services/api';
import { Country, LocationOption, WeatherData } from './types';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize: Fetch countries list
  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (err) {
        console.error("Init failed", err);
        setError("Failed to load global location database.");
      } finally {
        setLoadingLocations(false);
      }
    };
    init();
  }, []);

  // Handler: When a location is selected
  const handleLocationSelect = async (location: LocationOption) => {
    setSelectedLocation(location);
    setLoadingWeather(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await fetchWeather(location.lat, location.lng);
      setWeatherData(data);
    } catch (err) {
      console.error(err);
      setError("Unable to establish connection with local weather sensors.");
    } finally {
      setLoadingWeather(false);
    }
  };

  return (
    <Layout>
      {/* Header / Brand */}
      <header className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-eve-pink to-eve-purple rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,0,204,0.5)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">
              VIBE <span className="text-eve-pink">CODING</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Weather System</p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" title="System Online" />
      </header>

      {/* Search Section */}
      <SearchBar 
        countries={countries} 
        isLoadingLocations={loadingLocations} 
        onSelectLocation={handleLocationSelect} 
      />

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center justify-center backdrop-blur-sm">
          <span>⚠ {error}</span>
        </div>
      )}

      {/* Main Display */}
      <WeatherCard 
        data={weatherData} 
        location={selectedLocation} 
        loading={loadingWeather} 
      />

      {/* Details Grid */}
      <DetailsGrid 
        data={weatherData} 
        loading={loadingWeather} 
      />

      {/* Footer / Credits */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-xs text-gray-600">
          POWERED BY OPEN-METEO & REST COUNTRIES
        </p>
        <p className="text-[10px] text-gray-700 mt-1 uppercase tracking-widest">
          Style: K/DA All Out
        </p>
      </footer>
    </Layout>
  );
};

export default App;
