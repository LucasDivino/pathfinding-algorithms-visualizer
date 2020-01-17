import { setNode, getNeighbors } from './utils';

export function mazeGenerator(grid, node) {
  setNode(grid);
  setWalls(grid);
  node.isVisited = true;
  const stack = [node];
  while (stack.length !== 0) {
    const currentNode = stack.pop();
    const neighbors = getUnvisitedNeighborsInRandomOrder(grid, currentNode);
    currentNode.isVisited = true;
    if (neighbors.length !== 0) {
      stack.push(currentNode);
      removeWall(grid, currentNode, neighbors[0]);
      neighbors.isVisited = true;
      stack.push(neighbors[0]);
    }
  }
  return grid;
}

function removeWall(grid, node, neighbor) {
  if (node.col === neighbor.col && node.row > neighbor.row) {
    grid[node.row - 1][node.col].isWall = false;
  }
  if (node.col > neighbor.col && node.row === neighbor.row) {
    grid[node.row][node.col - 1].isWall = false;
  }
  if (node.col === neighbor.col && node.row < neighbor.row) {
    grid[node.row + 1][node.col].isWall = false;
  }
  if (node.col < neighbor.col && node.row && neighbor.row) {
    grid[node.row][node.col + 1].isWall = false;
  }
}

function setWalls(grid) {
  for (let i = 0; i < grid.length; i += 2) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j]) {
        if (!grid[i][j].isStart && !grid[i][j].isFisish) {
          grid[i][j].isWall = true;
        }
      }
    }
  }
  for (let i = 0; i < grid[0].length; i += 2) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i]) {
        if (!grid[j][i].isStart && !grid[j][i].isFisish) {
          grid[j][i].isWall = true;
        }
      }
    }
  }
}

function getUnvisitedNeighborsInRandomOrder(grid, node) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 1) {
    neighbors.push(grid[row - 2][col]);
  }
  if (row < grid.length - 2) {
    neighbors.push(grid[row + 2][col]);
  }
  if (col > 1) {
    neighbors.push(grid[row][col - 2]);
  }
  if (col < grid[0].length - 2) {
    neighbors.push(grid[row][col + 2]);
  }
  neighbors.sort(() => Math.random() - 0.5);
  return neighbors.filter(item => !item.isVisited);
}
