// src/components/MapView.js
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

function MapView({ start, end }) {
  return (
    <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '60vh' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {start && <Marker position={start} />}
      {end && <Marker position={end} />}
    </MapContainer>
  );
}

export default MapView;
