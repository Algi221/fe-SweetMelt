"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Helper component to handle map movement and clicks
function MapController({ 
  searchResult, 
  onSelect 
}: { 
  searchResult: { lat: number; lng: number } | null, 
  onSelect: (c: { lat: number; lng: number }) => void 
}) {
  const map = useMap();
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);

  // Update map and marker when search result changes
  useEffect(() => {
    if (searchResult) {
      map.flyTo([searchResult.lat, searchResult.lng], 16);
      setMarkerPos(searchResult);
    }
  }, [searchResult, map]);

  // Handle click to set marker manually
  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setMarkerPos(newPos);
      onSelect(newPos);
    },
  });

  return markerPos ? <Marker position={[markerPos.lat, markerPos.lng]} /> : null;
}

export default function MapContent({ 
  searchResult, 
  onSelect 
}: { 
  searchResult: { lat: number; lng: number } | null, 
  onSelect: (c: { lat: number; lng: number }) => void 
}) {
  const defaultCenter: [number, number] = [-6.9147, 107.6098];

  useEffect(() => {
    // Fix Leaflet marker icons
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapController searchResult={searchResult} onSelect={onSelect} />
    </MapContainer>
  );
}
