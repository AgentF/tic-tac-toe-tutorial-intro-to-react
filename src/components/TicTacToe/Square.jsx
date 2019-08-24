import React from 'react';
import PropTypes from 'prop-types';

const Square = ({ value, id, onClick }) => {
  return (
    <button
      className={`square played-${value}`}
      type="button"
      id={id}
      onClick={onClick}
    >
      {value === 'X' ? <i className="material-icons">close</i> : ''}
      {value === 'O' ? <i className="material-icons">trip_origin</i> : ''}
    </button>
  );
};

Square.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Square;
