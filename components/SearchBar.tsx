import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Country, LocationOption } from '../types';

interface SearchBarProps {
  countries: Country[];
  onSelectLocation: (location: LocationOption) => void;
  isLoadingLocations: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ countries, onSelectLocation, isLoadingLocations }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries and capitals
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const seen = new Set<string>();
    const filtered: LocationOption[] = [];

    // Helper to add unique suggestion
    const addSuggestion = (item: LocationOption) => {
        const key = `${item.name}-${item.subLabel}`;
        if (!seen.has(key)) {
            seen.add(key);
            filtered.push(item);
        }
    };

    // Iterate through countries to find matches for Country Name OR Capital Name
    for (const c of countries) {
        // Optimization: Stop if we have enough suggestions to show
        // We set a slightly higher limit here to allow sorting later if needed, 
        // but for now we just take the first 15 matches to keep UI snappy.
        if (filtered.length >= 15) break;

        const countryName = c.name.common;
        const capitalName = c.capital?.[0]; // Primary capital

        // 1. Match Country Name
        if (countryName.toLowerCase().includes(lowerQuery)) {
            addSuggestion({
                name: countryName,
                subLabel: capitalName ? `Capital: ${capitalName}` : undefined,
                lat: c.latlng[0],
                lng: c.latlng[1],
                flag: c.flags.svg
            });
        }

        // 2. Match Capital Name
        if (capitalName && capitalName.toLowerCase().includes(lowerQuery)) {
            // Use capital coordinates if available, else fallback to country
            const lat = c.capitalInfo?.latlng?.[0] ?? c.latlng[0];
            const lng = c.capitalInfo?.latlng?.[1] ?? c.latlng[1];

            addSuggestion({
                name: capitalName,
                subLabel: countryName,
                lat: lat,
                lng: lng,
                flag: c.flags.svg
            });
        }
    }

    setSuggestions(filtered);
    setIsOpen(true);
  }, [query, countries]);

  const handleSelect = (loc: LocationOption) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-50 mb-8">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-eve-pink group-focus-within:text-white transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3 bg-eve-glass border border-white/10 rounded-xl leading-5 text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:border-eve-magenta focus:ring-1 focus:ring-eve-magenta sm:text-sm transition-all shadow-lg backdrop-blur-md"
          placeholder={isLoadingLocations ? "Loading world map..." : "Search City or Country..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoadingLocations}
        />
        {query && (
            <button 
                onClick={() => { setQuery(''); setIsOpen(false); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
                <X className="h-4 w-4" />
            </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute mt-2 w-full bg-gray-900/95 border border-eve-magenta/30 rounded-xl shadow-2xl max-h-60 overflow-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.name}-${index}`}
              className="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-eve-purple/50 border-b border-white/5 last:border-0 transition-colors"
              onClick={() => handleSelect(suggestion)}
            >
              <div className="flex items-center">
                <img src={suggestion.flag} alt="" className="h-5 w-8 object-cover rounded shadow-sm mr-3" />
                <div className="flex flex-col">
                  <span className="block truncate font-medium text-gray-100">{suggestion.name}</span>
                  {suggestion.subLabel && (
                    <span className="block truncate text-xs text-eve-magenta/80">{suggestion.subLabel}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {isOpen && query && suggestions.length === 0 && (
         <div className="absolute mt-2 w-full bg-gray-900/90 border border-white/10 rounded-xl p-4 text-center text-gray-400 backdrop-blur-xl">
             No location found.
         </div>
      )}
    </div>
  );
};

export default SearchBar;