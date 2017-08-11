import React from 'react';
import Grafico from './Grafico';
import InfoRiepilogo from './InfoRiepilogo';
import TabellaNotifiche from './TabellaNotifiche';

class Riepilogo extends React.Component{
  render(){
    return (
      <div className="mt-3">
        <InfoRiepilogo misCorrenti={2} misTotali={96}/>
        <TabellaNotifiche />
        <Grafico titolo="Grafico latenza"/>
        <Grafico titolo="Grafico download"/>
        <Grafico titolo="Grafico upload"/>
      </div>
    )
  }
}

export default Riepilogo;
