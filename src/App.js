import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

const App = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);

  // Handles map click to set source and destination
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

  // Fetch route from ORS when both source & destination are set
  useEffect(() => {
    const fetchRoute = async () => {
      if (source && destination) {
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

          const geojson = response.data;
          const coordinates = geojson.features[0].geometry.coordinates;
          const leafletCoords = coordinates.map(coord => [coord[1], coord[0]]);
          setPath(leafletCoords);
        } catch (error) {
          console.error('Error fetching route from ORS:', error);
        }
      }
    };

    fetchRoute();
  }, [source, destination]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[28.6448, 77.216721]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LocationSelector />

        {source && <Marker position={source} icon={L.icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", iconSize: [32, 32] })} />}
        {destination && <Marker position={destination} icon={L.icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", iconSize: [32, 32] })} />}
        {path.length > 0 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default App;
