import React from 'react';

const Pulsante=(props)=>{
  return (
    <div className="text-xs-center mt-1 mb-2">
      <button
        className="btn btn-outline-primary btn-lg"
        onClick={props.onClick}>
          START
      </button>
    </div>
  )
}

/*
Pulsante.propTypes = {
  onClick: React.propTypes.func
};
*/
export default Pulsante;
