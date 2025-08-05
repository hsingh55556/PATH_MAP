import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import axios from 'axios';

// Component to handle map clicks and update start/end points
const MapClickHandler = ({ start, end, setStart, setEnd }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (!start) setStart([lat, lng]);
      else if (!end) setEnd([lat, lng]);
      else {
        // Reset after both points are selected
        setStart([lat, lng]);
        setEnd(null);
      }
    },
  });
  return null;
};

function App() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState([]);
  const [algorithm, setAlgorithm] = useState('dijkstra'); // placeholder for future use

  const fetchRoute = async () => {
    if (!start || !end) return;
    const coords = `${start[1]},${start[0]};${end[1]},${end[0]}`;
    try {
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
      );
      const geometry = res.data.routes[0].geometry.coordinates;
      const path = geometry.map(coord => [coord[1], coord[0]]);
      setRoute(path);
    } catch (err) {
      console.error("Failed to fetch route", err);
    }
  };

  return (
    <div>
      <h2>Shortest Path Visualizer (Map)</h2>

      <div style={{ margin: '10px 0' }}>
        <label>Select Algorithm: </label>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
        </select>
        <button onClick={fetchRoute} style={{ marginLeft: '10px' }}>
          Find Route
        </button>
      </div>

      <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '75vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler start={start} end={end} setStart={setStart} setEnd={setEnd} />
        {start && <Marker position={start} />}
        {end && <Marker position={end} />}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
}

export default App;
