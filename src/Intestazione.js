import React from 'react';

const Intestazione = (props) =>{
  return (
    <div className={"mb-2"}>
      <h2>{props.hdr}</h2>
        {props.par}
    </div>
  )
}

export default Intestazione;
