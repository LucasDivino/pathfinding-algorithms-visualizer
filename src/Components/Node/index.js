import React from 'react';

import './styles.css';

export default function Node(props) {
  const { col, row, isFinish, isStart, isWall, onMouseDown, onMouseEnter, onMouseUp } = props;
  const colorClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';
  return (
    <div
      className={`node ${colorClassName}`}
      id={`${row},${col}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    >
      {' '}
    </div>
  );
}
