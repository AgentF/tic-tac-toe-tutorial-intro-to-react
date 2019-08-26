import React from 'react';
import PropTypes from 'prop-types';
import './Square.css';

const Square = ({ info: { value, status, id }, onClick }) => {
  let statusClass = 'square';
  switch (status) {
    case 3:
      statusClass += ' selected';
      break;
    case 2:
      statusClass += ' winner';
      break;
    default:
      break;
  }
  return (
    <button className={statusClass} type="button" onClick={() => onClick(id)}>
      {value === 'X' ? <i className="material-icons">close</i> : ''}
      {value === 'O' ? <i className="material-icons">trip_origin</i> : ''}
    </button>
  );
};

Square.propTypes = {
  info: PropTypes.shape({
    value: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Square;
