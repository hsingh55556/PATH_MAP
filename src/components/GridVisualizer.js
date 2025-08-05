// src/components/GridVisualizer.js
import React, { useEffect, useState } from 'react';
import { dijkstra, astar } from '../utils/pathfindingAlgorithms';

const ROWS = 20;
const COLS = 40;

function GridVisualizer({ start, end, algorithm }) {
  const [grid, setGrid] = useState([]);
  const [path, setPath] = useState([]);

  useEffect(() => {
    const newGrid = Array.from({ length: ROWS }, (_, i) =>
      Array.from({ length: COLS }, (_, j) => ({
        row: i,
        col: j,
        isStart: false,
        isEnd: false,
        isPath: false,
      }))
    );

    if (start && end) {
      const startCell = {
        row: Math.floor((start[0] - 28.60) * 100),
        col: Math.floor((start[1] - 77.20) * 100),
      };
      const endCell = {
        row: Math.floor((end[0] - 28.60) * 100),
        col: Math.floor((end[1] - 77.20) * 100),
      };

      if (startCell.row >= 0 && endCell.row >= 0) {
        newGrid[startCell.row][startCell.col].isStart = true;
        newGrid[endCell.row][endCell.col].isEnd = true;

        let path = [];
        if (algorithm === "dijkstra") {
          path = dijkstra(newGrid, startCell, endCell);
        } else {
          path = astar(newGrid, startCell, endCell);
        }

        for (const cell of path) {
          newGrid[cell.row][cell.col].isPath = true;
        }

        setPath(path);
      }
    }

    setGrid(newGrid);
  }, [start, end, algorithm]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 20px)` }}>
      {grid.flat().map((cell, i) => (
        <div
          key={i}
          style={{
            width: 20,
            height: 20,
            backgroundColor: cell.isStart
              ? 'green'
              : cell.isEnd
              ? 'red'
              : cell.isPath
              ? 'yellow'
              : '#ddd',
            border: '1px solid #999',
          }}
        />
      ))}
    </div>
  );
}

export default GridVisualizer;
