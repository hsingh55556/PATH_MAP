import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const App = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [path, setPath] = useState([]);

  const apiKey = import.meta.env.VITE_ORS_API_KEY;

  const fetchRoute = async () => {
    if (!startLocation || !endLocation) return;

    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          coordinates: [
            [startLocation.lng, startLocation.lat],
            [endLocation.lng, endLocation.lat],
          ],
        },
        {
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const routeCoords = response.data.features[0].geometry.coordinates.map(coord => ({
        lat: coord[1],
        lng: coord[0],
      }));

      setPath(routeCoords);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        if (!startLocation) {
          setStartLocation(e.latlng);
        } else if (!endLocation) {
          setEndLocation(e.latlng);
        }
      },
    });
    return null;
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Pathfinding Visualizer with OpenRouteService</h2>
      <MapContainer center={[28.6139, 77.209]} zoom={13} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationSelector />
        {startLocation && <Marker position={startLocation} icon={L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', iconSize: [32, 32] })} />}
        {endLocation && <Marker position={endLocation} icon={L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', iconSize: [32, 32] })} />}
        {path.length > 0 && <Polyline positions={path} color="blue" />}
      </MapContainer>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={fetchRoute} disabled={!startLocation || !endLocation}>
          Show Route
        </button>
      </div>
    </div>
  );
};

export default App;
