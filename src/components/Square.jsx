import React from 'react';
import './Square.css';

const Square = (props) => {
  return (
    <button className={`square played-${props.value}`} id={props.id}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

export default Square;
