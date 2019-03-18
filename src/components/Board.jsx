import React from 'react';
import Square from './Square';
import './Board.css';

const Board = (props) => {
  return (
    props.squares.map((row, i) =>
      <div className="board-row" key={`row-${i}`}>
        {row.map(({ value }, j) =>
          <Square
            id={`square-${i}-${j}`}
            key={`square-${i}-${j}`}
            value={value}
            onClick={() => props.onClick(i, j)}
          />
        )}
      </div>
    )
  );
}

export default Board;
