import React from 'react';

const Pulsante=(props)=>{
  return (
    <div className="text-xs-center">
      <button
        className="btn btn-outline-primary btn-lg"
        style={{
          borderRadius:4
        }}
        onClick={props.onClick}>
          START
      </button>
    </div>
  )
}

/*
Pulsante.propTypes = {
  onClick: React.PropTypes.func
};
*/
export default Pulsante;
