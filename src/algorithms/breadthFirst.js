import { setNode, getNeighbors } from './utils';

export function BFS(grid, startNode) {
  setNode(grid);
  const visitedNodes = [];
  startNode.distance = 0;
  let queue = [startNode];
  let currentNode;

  while (queue.length !== 0) {
    currentNode = queue.shift();
    if (currentNode.isWall) continue;
    visitedNodes.push(currentNode);
    if (currentNode.isFinish) break;
    currentNode.isVisited = true;
    let currentConnected = getNeighbors(currentNode, grid);
    for (let i = 0; i < currentConnected.length; i++) {
      if (currentConnected[i].distance === Infinity) {
        currentConnected[i].distance = currentNode.distance + 1;
        currentConnected[i].previousNode = currentNode;
        queue.push(currentConnected[i]);
      }
    }
  }
  return visitedNodes;
}
