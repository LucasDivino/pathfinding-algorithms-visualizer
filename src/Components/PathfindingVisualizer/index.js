/* eslint-disable */
import React, { Component } from 'react';
import Node from '../Node';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { dijkstra } from '../../algorithms/dijkstra';
import { BFS } from '../../algorithms/breadthFirst';
import { DFS } from '../../algorithms/depthFirst';
import { getShortestPath } from '../../algorithms/utils';

import './styles.css';

let START_ROW = 0;
let START_COL = 0;
let FINISH_ROW = 24;
let FINISH_COL = 0;

let HAS_START = true;
let HAS_FINISH = true;

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: START_ROW === row && START_COL === col,
    isFinish: FINISH_ROW === row && FINISH_COL === col
  };
};

const InitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 25; row++) {
    const currentRow = [];
    for (let col = 0; col < Math.floor((screen.width - 25) / 26); col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const getGridWithStart = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  let newNode;
  if (row !== FINISH_ROW || col !== FINISH_COL) {
    newNode = {
      ...node,
      isWall: false,
      isStart: !node.isStart,
      isFinish: false
    };
    newGrid[row][col] = newNode;
    HAS_START = true;
    START_ROW = row;
    START_COL = col;
  }

  return newGrid;
};

const getGridWithFinish = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  let newNode;
  if (row !== START_ROW || col !== START_COL) {
    newNode = {
      ...node,
      isWall: false,
      isFinish: true,
      isStart: false
    };
    newGrid[row][col] = newNode;
    HAS_FINISH = true;
    FINISH_ROW = row;
    FINISH_COL = col;
  }
  return newGrid;
};

const getGridWithWalls = (grid, row, col) => {
  if (!HAS_START) {
    return getGridWithStart(grid, row, col);
  }
  if (!HAS_FINISH) {
    return getGridWithFinish(grid, row, col);
  }
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  let newNode;
  if (!node.isStart && !node.isFinish) {
    newNode = {
      ...node,
      isWall: !node.isWall
    };
    newGrid[row][col] = newNode;
  } else {
    if (node.isStart) {
      newNode = {
        ...node,
        isStart: !node.isStart
      };
      HAS_START = false;
      newGrid[row][col] = newNode;
    }
    if (node.isFinish) {
      newNode = {
        ...node,
        isFinish: !node.isFinish
      };
      HAS_FINISH = false;
      newGrid[row][col] = newNode;
    }
  }
  return newGrid;
};

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      algorithm: 'algorithms',
      grid: [],
      isPressed: false,
      show: false,
      alertText: ''
    };
  }

  handleClickVisualize() {
    if (!HAS_START || !HAS_FINISH) {
      this.setState({
        alertText: 'Place finish and start on board to visualize the algorithm',
        show: true
      });
    } else {
      switch (this.state.algorithm) {
        case 'Dijkstra':
          this.visualizeDijkstra();
          break;
        case 'BFS':
          this.visualizeBFS();
          break;
        case 'DFS':
          this.visualizeDFS();
          break;
        default:
          this.setState({ alertText: 'Choose an algorithm', show: true });
      }
    }
  }

  handleMouseDown(row, col) {
    const newGrid = getGridWithWalls(this.state.grid, row, col);
    this.setState({ grid: newGrid, isPressed: true });
  }

  handleMouseEnter(row, col) {
    if (this.state.isPressed) {
      const newGrid = getGridWithWalls(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({ isPressed: false });
  }

  componentDidMount() {
    const grid = InitialGrid(10, 10, 10, 30);
    this.setState({ grid });
  }

  handleChangeAlgorithm(algorithm) {
    this.setState({ algorithm: algorithm });
  }

  handleClickClearPath() {
    const { grid } = this.state;
    const newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      const currentRow = [];
      for (let j = 0; j < grid[i].length; j++) {
        const node = grid[i][j];
        node.isVisited = false;
        let extraClasses;
        if (node.isStart) {
          extraClasses = 'node-start';
        }
        if (node.isFinish) {
          extraClasses = 'node-finish';
        }
        if (node.isWall) {
          extraClasses = 'node-wall';
        }
        currentRow.push(node);
        document.getElementById(`${i},${j}`).className = `node ${extraClasses}`;
      }
      newGrid.push(currentRow);
    }
    this.setState({ grid: newGrid });
  }

  handleClickClearBoard() {
    const { grid } = this.state;
    const newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      const currentRow = [];
      for (let j = 0; j < grid[i].length; j++) {
        let extraClasses;
        const node = grid[i][j];
        node.isWall = false;
        node.isVisited = false;
        if (node.isStart) {
          extraClasses = 'node-start';
        }
        if (node.isFinish) {
          extraClasses = 'node-finish';
        }
        currentRow.push(node);
        document.getElementById(`${i},${j}`).className = `node ${extraClasses}`;
      }
      newGrid.push(currentRow);
    }
    this.setState({ grid: newGrid });
  }

  animateShortestPath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        document.getElementById(`${node.row},${node.col}`).className = 'node node-shortest-path';
      }, 30 * i);
    }
  }

  animate(visitedNodes, shortestPath) {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.animateShortestPath(shortestPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        document.getElementById(`${node.row},${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  }

  animateDFS(visitedNodes, shortestPath) {
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        const node = visitedNodes[i];
        document.getElementById(`${node.row},${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  }

  visualizeBFS() {
    const { grid } = this.state;
    const startNode = grid[START_ROW][START_COL];
    const finishNode = grid[FINISH_ROW][FINISH_COL];
    const visitedNodes = BFS(grid, startNode);
    const shortestPath = getShortestPath(finishNode);
    this.animate(visitedNodes, shortestPath);
  }

  visualizeDFS() {
    const { grid } = this.state;
    const startNode = grid[START_ROW][START_COL];
    const finishNode = grid[FINISH_ROW][FINISH_COL];
    const visitedNodes = DFS(grid, startNode);
    dijkstra(grid, startNode, finishNode);
    const shortestPath = getShortestPath(finishNode);
    this.animate(visitedNodes, shortestPath);
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_ROW][START_COL];
    const finishNode = grid[FINISH_ROW][FINISH_COL];
    const visitedNodes = dijkstra(grid, startNode, finishNode);
    const shortestPath = getShortestPath(finishNode);
    this.animate(visitedNodes, shortestPath);
  }

  render() {
    const { grid } = this.state;
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <div>
            <Navbar.Brand>
              <span className="logo">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                Pathfinder
              </span>
            </Navbar.Brand>
          </div>

          <Button
            variant="outline-light"
            className="rightSpace"
            onClick={() => this.handleClickClearBoard()}
          >
            Clear Board
          </Button>
          <Button
            variant="outline-light"
            className="rightSpace"
            onClick={() => this.handleClickClearPath()}
          >
            Clear Path
          </Button>
          <NavDropdown
            className="dropdownFont"
            title={<span className="navColor">{this.state.algorithm}</span>}
          >
            <NavDropdown.Item onClick={() => this.handleChangeAlgorithm('Dijkstra')}>
              Dijkstra
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => this.handleChangeAlgorithm('BFS')}>
              BFS
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => this.handleChangeAlgorithm('DFS')}>
              DFS
            </NavDropdown.Item>
          </NavDropdown>
          <Button variant="light" onClick={() => this.handleClickVisualize()}>
            Visualize!
          </Button>
        </Navbar>
        <div className="spacingGrid">
          {grid.map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="spacingRow">
                {row.map((node, nodeIndex) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      isPressed={this.state.isPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      key={nodeIndex}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
          <Alert
            show={this.state.show}
            variant="danger"
            onClose={() => this.setState({ show: false })}
            dismissible
          >
            {this.state.alertText}
          </Alert>
        </div>
      </>
    );
  }
}
