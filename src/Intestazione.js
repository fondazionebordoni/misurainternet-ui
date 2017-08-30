import React from 'react';

const Intestazione = (props) =>{
  return (
    <div>
      <h2>{props.hdr}</h2>
        {props.par}
    </div>
  )
}

export default Intestazione;
