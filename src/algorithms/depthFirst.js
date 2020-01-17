import { setNode, getNeighbors } from './utils';

export function DFS(grid, startNode) {
  setNode(grid);
  const visitedNodes = [];
  startNode.distance = 0;
  let stack = [startNode];

  while (stack.length !== 0) {
    let currentNode = stack.pop();
    if (currentNode.isWall) continue;
    if (currentNode.isVisited === false) {
      visitedNodes.push(currentNode);
      currentNode.isVisited = true;
      if (currentNode.isFinish) break;
      let currentConnected = getNeighbors(currentNode, grid);
      for (let i = 0; i < currentConnected.length; i++) {
        currentConnected[i].distance = currentNode.distance + 1;
        stack.push(currentConnected[i]);
      }
    }
  }
  return visitedNodes;
}
