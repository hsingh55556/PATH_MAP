// src/components/MapView.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import axios from "axios";
import L from "leaflet";

const ORS_API_KEY = "YOUR_ORS_API_KEY_HERE"; // Replace with your actual key

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

const MapView = ({ start, end, setStart, setEnd }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const getRoute = async () => {
      if (!start || !end) return;

      try {
        const response = await axios.post(
          `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
          {
            coordinates: [
              [start[1], start[0]],
              [end[1], end[0]],
            ],
          },
          {
            headers: {
              Authorization: ORS_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const coords = response.data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoute(coords);
      } catch (err) {
        console.error("Error fetching route", err);
      }
    };

    getRoute();
  }, [start, end]);

  const handleClick = (e) => {
    const { lat, lng } = e.latlng;
    if (!start) {
      setStart([lat, lng]);
    } else if (!end) {
      setEnd([lat, lng]);
    } else {
      setStart([lat, lng]);
      setEnd(null);
      setRoute([]);
    }
  };

  return (
    <MapContainer center={[28.6139, 77.209]} zoom={13} style={{ height: "80vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler onClick={handleClick} />
      {start && <Marker position={start} />}
      {end && <Marker position={end} />}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default MapView;
