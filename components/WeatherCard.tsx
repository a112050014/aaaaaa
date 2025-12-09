import React from 'react';
import { WeatherData, LocationOption } from '../types';
import { getWeatherDescription, getWeatherIcon } from '../services/weatherCodes';
import { MapPin } from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData | null;
  location: LocationOption | null;
  loading: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, location, loading }) => {
  if (loading) {
    return (
      <div className="w-full h-80 rounded-[2rem] bg-white/5 animate-pulse flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="w-16 h-16 border-4 border-eve-pink border-t-transparent rounded-full animate-spin mb-4 relative z-10"></div>
        <p className="text-eve-accent text-sm tracking-widest uppercase relative z-10">Scanning Atmosphere...</p>
      </div>
    );
  }

  if (!data || !location) {
    return (
      <div className="w-full h-64 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex flex-col items-center justify-center text-center p-6 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-eve-purple/20 blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
        <MapPin className="w-12 h-12 text-gray-600 mb-2 opacity-50 relative z-10" />
        <h3 className="text-xl font-semibold text-gray-300 relative z-10">No Location Selected</h3>
        <p className="text-gray-500 text-sm mt-2 relative z-10">Search for a city to begin your analysis.</p>
      </div>
    );
  }

  const weatherDesc = getWeatherDescription(data.current.weather_code);
  const weatherIcon = getWeatherIcon(data.current.weather_code, data.current.is_day);

  // Generate a vibe-consistent image URL based on location
  const imagePrompt = encodeURIComponent(`cinematic night shot of ${location.name} city skyline, futuristic, cyberpunk, neon purple and pink lights, dark atmosphere, 8k, highly detailed`);
  const bgImage = `https://image.pollinations.ai/prompt/${imagePrompt}?width=800&height=600&nologo=true`;

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-eve-dark border border-eve-magenta/30 shadow-[0_0_30px_rgba(176,38,255,0.15)] mb-6 group transition-all hover:shadow-[0_0_50px_rgba(176,38,255,0.3)]">
      
      {/* --- Hero Image Background --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt={`${location.name} scenery`}
          className="w-full h-full object-cover opacity-80 transition-transform duration-[2000ms] ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-eve-dark/60 to-eve-dark/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-eve-dark via-transparent to-black/40" />
      </div>

      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-eve-pink to-transparent opacity-70 z-20" />

      {/* --- Content --- */}
      <div className="relative z-10 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="drop-shadow-lg">
            <h2 className="text-4xl font-black text-white tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {location.name}
            </h2>
            {location.subLabel && (
              <p className="text-eve-accent/90 text-sm font-bold flex items-center mt-2 tracking-wider uppercase bg-black/40 w-fit px-2 py-1 rounded backdrop-blur-sm border border-white/5">
                <MapPin className="w-3 h-3 mr-1" /> {location.subLabel}
              </p>
            )}
          </div>
          <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl group-hover:border-eve-magenta/50 transition-colors">
            {weatherIcon}
          </div>
        </div>

        {/* Main Stats */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] z-20">
            {Math.round(data.current.temperature_2m)}°
          </h1>
          <p className="text-2xl font-bold text-eve-pink tracking-[0.2em] uppercase mt-[-10px] mb-6 drop-shadow-[0_0_10px_rgba(176,38,255,0.8)] z-20">
            {weatherDesc}
          </p>
          
          {/* Subtle glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-eve-magenta rounded-full blur-[80px] opacity-20 z-0" />
        </div>

        {/* AI Context Data (Apparent Temp) */}
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors cursor-help group/item">
          <span className="text-gray-300 text-xs uppercase tracking-wider font-bold">AI Feel Metric</span>
          <span className="text-white font-bold text-lg drop-shadow-md">
            Feels like <span className="text-eve-accent group-hover/item:text-white transition-colors">{Math.round(data.current.apparent_temperature)}°</span>
          </span>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;