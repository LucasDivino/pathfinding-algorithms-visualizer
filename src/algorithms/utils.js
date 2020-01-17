export function getShortestPath(finishNode) {
  const shortestPath = [];
  let currentNode = finishNode;
  while (currentNode !== undefined) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return shortestPath;
}

export function setNode(grid) {
  for (const row of grid) {
    for (const node of row) {
      node.isVisited = false;
      node.distance = Infinity;
      node.previousNode = undefined;
      node.isVisited = false;
    }
  }
}

export function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}
