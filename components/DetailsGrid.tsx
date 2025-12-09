import React from 'react';
import { WeatherData } from '../types';
import { Droplets, Wind, CloudRain } from 'lucide-react';

interface DetailsGridProps {
  data: WeatherData | null;
  loading: boolean;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string; unit: string; delay: string }> = ({ icon, label, value, unit, delay }) => (
  <div className={`bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-start justify-between backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 ${delay} animate-in fade-in slide-in-from-bottom-4`}>
    <div className="mb-2 text-eve-pink p-2 bg-eve-purple/30 rounded-lg">
      {icon}
    </div>
    <div className="mt-2">
      <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value} <span className="text-sm text-gray-500 font-normal">{unit}</span>
      </p>
    </div>
  </div>
);

const DetailsGrid: React.FC<DetailsGridProps> = ({ data, loading }) => {
  if (loading || !data) return null;

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {/* Humidity */}
      <DetailItem 
        icon={<Droplets className="w-5 h-5" />}
        label="Humidity"
        value={data.current.relative_humidity_2m.toString()}
        unit="%"
        delay="delay-100"
      />

      {/* Wind Speed */}
      <DetailItem 
        icon={<Wind className="w-5 h-5" />}
        label="Wind Force"
        value={data.current.wind_speed_10m.toString()}
        unit="km/h"
        delay="delay-200"
      />

      {/* Precipitation - Only show if relevant or as a layout filler */}
      <div className="col-span-2">
          <DetailItem 
            icon={<CloudRain className="w-5 h-5" />}
            label="Precipitation"
            value={data.current.precipitation.toString()}
            unit="mm"
            delay="delay-300"
          />
      </div>
    </div>
  );
};

export default DetailsGrid;
