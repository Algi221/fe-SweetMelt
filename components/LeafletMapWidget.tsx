"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Loader2, X } from "lucide-react";

// Dynamically import the entire Map component to avoid SSR issues
const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-oreo-cream gap-3">
      <Loader2 className="animate-spin text-lumer" size={32} />
      <p className="text-oreo-black/40 text-sm font-medium">Menyiapkan peta...</p>
    </div>
  ),
});

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function LeafletMapWidget({ onSelect }: { onSelect: (c: { lat: number; lng: number }) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResult, setSearchResult] = useState<{ lat: number; lng: number } | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced Search for Suggestions
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=id`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Suggestion fetch error:", error);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleSelectSuggestion = (item: Suggestion) => {
    const newCoords = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    setSearchResult(newCoords);
    onSelect(newCoords);
    setSearchQuery(item.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full h-full relative">
      {/* Search Header Container */}
      <div className="absolute top-4 left-4 right-4 z-[2000] flex flex-col gap-2">
        {/* Search Bar */}
        <div 
          className="flex bg-oreo-white shadow-2xl rounded-2xl border border-oreo-light overflow-hidden transition-all focus-within:ring-2 focus-within:ring-lumer/50"
        >
          <div className="pl-4 flex items-center text-oreo-black/30">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik alamat atau nama jalan..."
            className="flex-1 bg-transparent border-none py-3.5 px-4 text-sm text-oreo-black placeholder:text-oreo-black/30 outline-none"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="px-3 text-oreo-black/20 hover:text-oreo-black transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <div className="bg-oreo-light/30 px-4 flex items-center">
             {isSearching ? <Loader2 className="animate-spin text-lumer" size={16} /> : <div className="w-4" />}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="bg-oreo-white rounded-2xl shadow-2xl border border-oreo-light overflow-hidden animate-fade-in max-h-[250px] overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSelectSuggestion(item)}
                className="w-full flex items-start gap-3 p-4 hover:bg-oreo-cream transition-colors text-left border-b border-oreo-light last:border-none group shadow-inner"
              >
                <div className="mt-0.5 bg-oreo-cream group-hover:bg-lumer group-hover:text-oreo-white p-1.5 rounded-lg transition-colors">
                  <MapPin size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-oreo-black truncate">
                    {item.display_name.split(',')[0]}
                  </p>
                  <p className="text-[10px] text-oreo-black/50 truncate mt-0.5">
                    {item.display_name.split(',').slice(1).join(',').trim()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContent searchResult={searchResult} onSelect={onSelect} />
      
      {/* Search Overlay/Backdrop when suggestions open */}
      {showSuggestions && (
        <div 
          className="absolute inset-0 bg-black/5 z-[1999]" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
