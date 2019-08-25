import React, { useState } from 'react';
import propTypes from 'prop-types';
import GameLog from './GameLog';

const Info = ({
  status,
  history,
  isReplaying,
  stepNumber,
  handleReplay,
  handleReset,
  handleJumpTo,
}) => {
  const [movesOrderIsDescending, setMovesOrderIsDescending] = useState(true);

  const undoStepNumber = stepNumber - 1 > 0 ? stepNumber - 1 : 0;
  const undoLastMove = history[undoStepNumber].lastMove;
  const redoStepNumber =
    stepNumber + 1 < history.length ? stepNumber + 1 : history.length - 1;
  const redoLastMove = history[redoStepNumber].lastMove;

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
          onClick={() => {
            handleJumpTo(undoStepNumber, undoLastMove);
          }}
          type="button"
        >
          <i className="material-icons">undo</i>
        </button>
        <button
          className="option-button"
          type="button"
          onClick={() => {
            handleJumpTo(redoStepNumber, redoLastMove);
          }}
        >
          <i className="material-icons">redo</i>
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
        {movesOrderIsDescending ? (
          <GameLog
            history={history}
            stepNumber={stepNumber}
            handleJumpTo={(pastStep, pastLastMove) => {
              handleJumpTo(pastStep, pastLastMove);
            }}
          />
        ) : (
          <GameLog
            history={[...history].reverse()}
            stepNumber={stepNumber}
            handleJumpTo={(pastStep, pastLastMove) => {
              handleJumpTo(pastStep, pastLastMove);
            }}
          />
        )}
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
  stepNumber: propTypes.number.isRequired,
  handleReplay: propTypes.func.isRequired,
  handleReset: propTypes.func.isRequired,
  handleJumpTo: propTypes.func.isRequired,
};

export default Info;
