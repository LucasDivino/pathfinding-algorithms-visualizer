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
      node.distance = Infinity;
      node.previousNode = undefined;
      node.isVisited = false;
    }
  }
}
