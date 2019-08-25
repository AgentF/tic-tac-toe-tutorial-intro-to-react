/* eslint-disable react/no-array-index-key */
import React from 'react';
import propTypes from 'prop-types';
import Square from './Square';

const Board = ({ squares, handleSquareClick }) => {
  return (
    <div className="game-board">
      {squares.map((row, i) => (
        <div className="board-row" key={`row-${i}`}>
          {row.map(({ value, status, id }) => (
            <Square
              key={id}
              info={{ value, status, id }}
              onClick={handleSquareClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

Board.propTypes = {
  squares: propTypes.arrayOf(
    propTypes.arrayOf(
      propTypes.shape({ value: propTypes.string.isRequired }).isRequired,
    ).isRequired,
  ).isRequired,
  handleSquareClick: propTypes.func.isRequired,
};

export default Board;
