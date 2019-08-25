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
  handleReverseHistory,
}) => {
  const [movesOrderIsDescending, setMovesOrderIsDescending] = useState(true);

  const currentId = history.findIndex(({ id }) => id === `move #${stepNumber}`);
  const undoStepNumber = currentId > 0 ? currentId - 1 : 0;
  const redoStepNumber =
    currentId < history.length - 1 ? currentId + 1 : history.length - 1;

  return (
    <div className="game-info">
      <div className="status">{status}</div>
      <div className="options-buttons">
        <button
          className="option-button"
          onClick={() => {
            setMovesOrderIsDescending(!movesOrderIsDescending);
            handleReverseHistory();
          }}
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
            handleJumpTo(`move #${undoStepNumber}`);
          }}
          type="button"
        >
          <i className="material-icons">undo</i>
        </button>
        <button
          className="option-button"
          type="button"
          onClick={() => {
            handleJumpTo(`move #${redoStepNumber}`);
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
        <GameLog
          history={history}
          stepNumber={stepNumber}
          handleJumpTo={id => {
            handleJumpTo(id);
          }}
        />
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
  handleReverseHistory: propTypes.func.isRequired,
};

export default Info;
