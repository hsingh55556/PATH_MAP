import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Optional: Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const App = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const [selectingStart, setSelectingStart] = useState(true);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra");

  // 🟢 Simulated pathfinding function (replace with actual Dijkstra or A*)
  const simulatePathfinding = () => {
    if (start && end) {
      setPath([start, end]); // Placeholder line
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (selectingStart) {
          setStart([lat, lng]);
        } else {
          setEnd([lat, lng]);
        }
      },
    });
    return null;
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Shortest Path Visualizer</h2>

      {/* 🧭 Algorithm Selector (FR03) */}
      <div style={{ padding: "10px", textAlign: "center" }}>
        <label>Select Algorithm: </label>
        <select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
          <option value="bfs">BFS</option>
        </select>
        <br />
        <button onClick={() => setSelectingStart(true)}>Set Start Location</button>
        <button onClick={() => setSelectingStart(false)}>Set End Location</button>
        <br />
        <button onClick={simulatePathfinding}>Find Path</button>
      </div>

      {/* 🗺️ Map Component (FR01) */}
      <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationSelector />
        {start && <Marker position={start}></Marker>}
        {end && <Marker position={end}></Marker>}
        {path.length > 1 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default App;
