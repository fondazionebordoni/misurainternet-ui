import React from 'react';

const Pulsante = (props) => {
  return (
    <div className="text-xs-center">
      <button
        id='mistButton'
        className="btn btn-outline-primary btn-lg pr-3 pl-3"
        style={{borderRadius: 3}}
        onClick={props.onClick}>
          START
      </button>
    </div>
  )
}

export default Pulsante;
