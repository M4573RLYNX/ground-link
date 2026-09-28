'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface PropertyMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  title: string;
}

export default function PropertyMap({ coordinates, title }: PropertyMapProps) {
  // Memoize the custom icon so it doesn't re-create on every render
  const customIcon = useMemo(() => {
    return new L.DivIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: var(--primary); 
          width: 32px; 
          height: 32px; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 2px solid white; 
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <div style="
            width: 10px; 
            height: 10px; 
            background: white; 
            border-radius: 50%; 
            transform: rotate(45deg);">
          </div>
        </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }, []);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]} icon={customIcon}>
          <Popup className="custom-popup">
            <span className="font-semibold">{title}</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}