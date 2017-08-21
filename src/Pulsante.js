import React from 'react';

const Pulsante=(props)=>{
  return (
    <div className="text-xs-center mt-1">
      <button
        className="btn btn-outline-primary btn-lg"
        style={{
          borderRadius: 3
        }}
        onClick={props.onClick}>
        <span
          style={
            {
              fontWeight: 'lighter'
            }
          }
          className="pr-1 pl-1">
          START
        </span>
      </button>
    </div>
  )
}


Pulsante.propTypes = {
  onClick: React.PropTypes.func
};

export default Pulsante;
