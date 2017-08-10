import React from 'react';
import Grafico from './Grafico';

class Riepilogo extends React.Component{
  render(){
    return (
      <div className="mt-3">


        <Grafico titolo="Grafico latenza"/>
        <Grafico titolo="Grafico download"/>
        <Grafico titolo="Grafico upload"/>
      </div>
    )
  }
}

export default Riepilogo;
