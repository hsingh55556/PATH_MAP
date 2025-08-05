import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const center = [28.6448, 77.216721]; // Default to Delhi

function LocationSelector({ setStart, setEnd, start, end }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (!start) {
        setStart([lat, lng]);
      } else if (!end) {
        setEnd([lat, lng]);
      }
    },
  });
  return null;
}

function App() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const [algorithm, setAlgorithm] = useState('dijkstra');

  const getRoute = async () => {
    if (!start || !end) return alert('Select both Start and End points on map.');

    const apiKey = process.env.REACT_APP_ORS_API_KEY;
    const url = `https://api.openrouteservice.org/v2/directions/driving-car`;

    try {
      const response = await axios.post(
        url,
        {
          coordinates: [ [start[1], start[0]], [end[1], end[0]] ]
        },
        {
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const routeCoords = response.data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setPath(routeCoords);
    } catch (error) {
      console.error('Error fetching route:', error);
      alert('Failed to fetch route');
    }
  };

  const reset = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Shortest Path Visualizer (Real Map)</h2>

      <div style={{ textAlign: 'center', margin: '10px' }}>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
        </select>
        <button onClick={getRoute} style={{ marginLeft: '10px' }}>Find Path</button>
        <button onClick={reset} style={{ marginLeft: '10px' }}>Reset</button>
      </div>

      <MapContainer center={center} zoom={13} style={{ height: '90vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <LocationSelector setStart={setStart} setEnd={setEnd} start={start} end={end} />

        {start && <Marker position={start} icon={L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', iconSize: [32, 32] })} />}
        {end && <Marker position={end} icon={L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', iconSize: [32, 32] })} />}
        {path.length > 0 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </div>
  );
}

export default App;
