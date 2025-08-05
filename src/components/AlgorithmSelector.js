// src/components/AlgorithmSelector.js
import React from 'react';

function AlgorithmSelector({ algorithm, setAlgorithm }) {
  return (
    <div>
      <label>Select Algorithm: </label>
      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
        <option value="dijkstra">Dijkstra</option>
        <option value="astar">A*</option>
      </select>
    </div>
  );
}

export default AlgorithmSelector;
