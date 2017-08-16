import React from 'react';

const Pulsante=(props)=>{
  return (
    <div className="text-xs-center">
      <button
        className="btn btn-outline-primary btn-lg"
        style={{
          borderRadius: 3
        }}
        onClick={props.onClick}>
        <span className="pr-1 pl-1">START</span>
      </button>
    </div>
  )
}


Pulsante.propTypes = {
  onClick: React.PropTypes.func
};

export default Pulsante;
