import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Marcador SVG personalizado para evitar errores de importación de assets en Vite/Webpack
const customIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div style="display: flex; justify-content: center; align-items: center; width: 32px; height: 32px;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#6A4AE3" stroke="#FFFFFF" stroke-width="2"/>
        <circle cx="12" cy="9" r="2.5" fill="#FFFFFF"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface MapPickerProps {
  onSelectLocation: (address: string, lat: number, lng: number) => void;
  initialCoords?: { lat: number; lng: number } | null;
}

// Recentra el mapa y recalcula el renderizado al cambiar el contenedor
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.2 });
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, map]);

  return null;
};

// Captura clics en el mapa
const LocationMarker: React.FC<{
  position: [number, number] | null;
  onSelect: (lat: number, lng: number) => void;
}> = ({ position, onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
};

export const MapPicker: React.FC<MapPickerProps> = ({ onSelectLocation, initialCoords }) => {
  const defaultCenter: [number, number] = [4.570868, -74.297333];

  const [center, setCenter] = useState<[number, number]>(
    initialCoords ? [initialCoords.lat, initialCoords.lng] : defaultCenter
  );
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    initialCoords ? [initialCoords.lat, initialCoords.lng] : null
  );
  const [loading, setLoading] = useState(false);

  // Actualiza el marcador si initialCoords cambia desde el componente padre (GPS)
  useEffect(() => {
    if (initialCoords?.lat && initialCoords?.lng) {
      const newCoords: [number, number] = [initialCoords.lat, initialCoords.lng];
      setCenter(newCoords);
      setMarkerPos(newCoords);
    }
  }, [initialCoords?.lat, initialCoords?.lng]);

  // Convierte coordenadas a dirección con Nominatim
  const fetchAddress = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept-Language': 'es',
          },
        }
      );
      const data = await response.json();
      const addressName = data.display_name || `Ubicación (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      onSelectLocation(addressName, lat, lng);
    } catch {
      onSelectLocation(`Ubicación (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    setCenter([lat, lng]);
    fetchAddress(lat, lng);
  };

  return (
    <div className="w-full space-y-2 my-2">
      <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
        <MapContainer center={center} zoom={initialCoords ? 15 : 6} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={center} />
          <LocationMarker position={markerPos} onSelect={handleSelect} />
        </MapContainer>
      </div>

      <div className="flex justify-between items-center text-xs">
        {loading ? (
          <span className="text-[#6A4AE3] font-medium animate-pulse">Obteniendo dirección...</span>
        ) : (
          <span className="text-gray-500">Toca cualquier punto del mapa para ubicar el incidente.</span>
        )}
      </div>
    </div>
  );
};

export default MapPicker;