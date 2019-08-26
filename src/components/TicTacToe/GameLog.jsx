import React from 'react';
import PropTypes from 'prop-types';
import './GameLog.css';

const GameLog = ({ history, stepNumber, handleJumpTo }) => (
  <ol className="last-moves">
    {history.map(({ id, lastMove: pastLastMove }) => {
      let message = '';
      if (id === 'move #0') {
        if (id === `move #${stepNumber}`) {
          message = `You are at game start`;
        } else {
          message = `Go to game start`;
        }
      } else if (id === `move #${stepNumber}`) {
        message = `Go to last move ${
          pastLastMove ? `(${pastLastMove[0] + 1}, ${pastLastMove[1] + 1})` : ''
        }`;
      } else {
        message = `Go to ${id} ${
          pastLastMove ? `(${pastLastMove[0] + 1}, ${pastLastMove[1] + 1})` : ''
        }`;
      }
      return (
        <li key={id}>
          <button
            className="last-move-button"
            onClick={() => handleJumpTo(id)}
            type="button"
          >
            {id === `move #${stepNumber}` ? (
              <strong>{message}</strong>
            ) : (
              message
            )}
          </button>
        </li>
      );
    })}
  </ol>
);

GameLog.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      squares: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.shape({ value: PropTypes.string.isRequired }).isRequired,
        ).isRequired,
      ).isRequired,
      lastMove: PropTypes.arrayOf(PropTypes.number),
    }).isRequired,
  ).isRequired,
  stepNumber: PropTypes.number.isRequired,
  handleJumpTo: PropTypes.func.isRequired,
};

export default GameLog;
