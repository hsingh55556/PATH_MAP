import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
//hi
const App = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (!source) {
          setSource([lat, lng]);
        } else if (!destination) {
          setDestination([lat, lng]);
        }
      }
    });
    return null;
  };

  const getRoute = async () => {
    if (!source || !destination) {
      alert('Please select both start and end points.');
      return;
    }

    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          coordinates: [
            [source[1], source[0]],
            [destination[1], destination[0]]
          ]
        },
        {
          headers: {
            Authorization: process.env.REACT_APP_ORS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      // Get coordinates from geojson
      const coords = response.data.features[0].geometry.coordinates;
      const formatted = coords.map(([lng, lat]) => [lat, lng]); // Flip to Leaflet [lat, lng]
      setPath(formatted);
    } catch (error) {
      console.error('Error fetching route:', error);
      alert('Failed to fetch route. Check your API key or internet connection.');
    }
  };

  const resetMap = () => {
    setSource(null);
    setDestination(null);
    setPath([]);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ textAlign: 'center', padding: '10px', background: '#f0f0f0' }}>
        <button onClick={getRoute} disabled={!source || !destination}>Visualize Path</button>
        <button onClick={resetMap} style={{ marginLeft: '10px' }}>Reset</button>
      </div>

      <MapContainer center={[28.6448, 77.216721]} zoom={13} style={{ height: '92vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <LocationSelector />

        {source && (
          <Marker
            position={source}
            icon={L.icon({
              iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              iconSize: [32, 32],
            })}
          />
        )}
        {destination && (
          <Marker
            position={destination}
            icon={L.icon({
              iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              iconSize: [32, 32],
            })}
          />
        )}
        {path.length > 0 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default App;
