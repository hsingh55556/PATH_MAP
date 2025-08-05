import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import axios from 'axios';

const MapClick = ({ setPoints }) => {
  useMapEvents({
    click(e) {
      setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
};

function App() {
  const [points, setPoints] = useState([]);
  const [route, setRoute] = useState([]);

  const fetchRoute = async () => {
    if (points.length < 2) return;
    const coords = points.map(p => p.reverse().join(',')).join(';'); // lon,lat
    const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
    setRoute(res.data.routes[0].geometry.coordinates.map(p => [p[1], p[0]]));
  };

  return (
    <div>
      <button onClick={fetchRoute}>Find Route</button>
      <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '90vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClick setPoints={setPoints} />
        {points.map((pos, i) => <Marker key={i} position={pos} />)}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
}

export default App;
