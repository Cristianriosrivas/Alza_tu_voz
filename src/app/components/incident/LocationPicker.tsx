import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix del ícono por defecto de Leaflet, que se rompe con bundlers como Vite
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

// Ubicación por defecto: Cali, Colombia (ajústala si quieres otra ciudad)
const DEFAULT_CENTER: [number, number] = [3.4516, -76.532];

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ latitude, longitude, onChange }) => {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const position: [number, number] =
    latitude != null && longitude != null ? [latitude, longitude] : DEFAULT_CENTER;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización.');
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setGeoError('No pudimos acceder a tu ubicación. Puedes marcarla manualmente en el mapa.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#1C1C1E]">Ubicación en el mapa (opcional)</label>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="text-xs font-medium text-[#FF6FAF] hover:underline disabled:opacity-50"
        >
          {locating ? 'Ubicando...' : '📍 Usar mi ubicación actual'}
        </button>
      </div>

      {geoError && <p className="text-xs text-red-600">{geoError}</p>}

      <div className="rounded-md overflow-hidden border border-[#B6B6B6]" style={{ height: 220 }}>
        <MapContainer
          center={position}
          zoom={latitude != null ? 15 : 12}
          style={{ height: '100%', width: '100%' }}
          key={`${position[0]}-${position[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          {latitude != null && longitude != null && <Marker position={position} icon={markerIcon} />}
        </MapContainer>
      </div>

      <p className="text-xs text-[#4A4A4A]">
        Toca el mapa para marcar el lugar exacto, o usa el botón de ubicación actual.
      </p>
    </div>
  );
};