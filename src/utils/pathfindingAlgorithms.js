// src/utils/pathfindingAlgorithms.js

export function dijkstra(grid, start, end) {
  const visited = new Set();
  const queue = [{ ...start, dist: 0 }];
  const cameFrom = {};

  while (queue.length) {
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift();
    const key = `${current.row}-${current.col}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (current.row === end.row && current.col === end.col) {
      const path = [];
      let k = key;
      while (cameFrom[k]) {
        const [r, c] = k.split('-').map(Number);
        path.unshift({ row: r, col: c });
        k = cameFrom[k];
      }
      return path;
    }

    for (const [dr, dc] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const nr = current.row + dr;
      const nc = current.col + dc;
      if (
        nr >= 0 &&
        nc >= 0 &&
        nr < grid.length &&
        nc < grid[0].length &&
        !visited.has(`${nr}-${nc}`)
      ) {
        queue.push({ row: nr, col: nc, dist: current.dist + 1 });
        cameFrom[`${nr}-${nc}`] = key;
      }
    }
  }

  return [];
}

export function astar(grid, start, end) {
  // Similar to dijkstra but use f(n) = g(n) + h(n)
  return dijkstra(grid, start, end); // Replace with real A* later
}
