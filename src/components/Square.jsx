import React from 'react';
import PropTypes from 'prop-types';
import './Square.css';

const Square = ({ value, id, onClick }) => {
  return (
    <button
      className={`square played-${value}`}
      type="button"
      id={id}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

Square.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Square;
