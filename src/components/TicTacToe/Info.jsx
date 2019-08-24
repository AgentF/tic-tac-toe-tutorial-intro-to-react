/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import propTypes from 'prop-types';

const Info = ({
  status,
  history,
  isReplaying,
  handleReplay,
  handleReset,
  handleJumpTo,
}) => {
  const [movesOrderIsDescending, setMovesOrderIsDescending] = useState(true);

  const moves = history.map(({ lastMove }, move) => (
    <li key={move}>
      <button
        className="last-move-button"
        onClick={() => handleJumpTo(move, lastMove)}
        type="button"
      >
        {move
          ? `Go to move #${move} ${
              lastMove ? `(${lastMove[0] + 1}, ${lastMove[1] + 1})` : ''
            }`
          : 'Go to game start'}
      </button>
    </li>
  ));

  return (
    <div className="game-info">
      <div className="status">{status}</div>
      <div className="options-buttons">
        <button
          className="option-button"
          onClick={() => setMovesOrderIsDescending(!movesOrderIsDescending)}
          type="button"
        >
          {movesOrderIsDescending ? (
            <i className="material-icons">arrow_downward</i>
          ) : (
            <i className="material-icons">arrow_upward</i>
          )}
        </button>
        <button
          className="option-button"
          onClick={isReplaying ? null : handleReplay}
          type="button"
        >
          <i className="material-icons">cached</i>
        </button>
        <button className="option-button" onClick={handleReset} type="button">
          <i className="material-icons">replay</i>
        </button>
      </div>
      <ol className="last-moves">
        {movesOrderIsDescending ? moves : [...moves].reverse()}
      </ol>
    </div>
  );
};

Info.propTypes = {
  status: propTypes.string.isRequired,
  history: propTypes.arrayOf(
    propTypes.shape({
      squares: propTypes.arrayOf(
        propTypes.arrayOf(
          propTypes.shape({ value: propTypes.string.isRequired }).isRequired,
        ).isRequired,
      ).isRequired,
      lastMove: propTypes.arrayOf(propTypes.number),
    }).isRequired,
  ).isRequired,
  isReplaying: propTypes.bool.isRequired,
  handleReplay: propTypes.func.isRequired,
  handleReset: propTypes.func.isRequired,
  handleJumpTo: propTypes.func.isRequired,
};

export default Info;
