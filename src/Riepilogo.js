import React from 'react';
import Grafico from './Grafico';
import InfoRiepilogo from './InfoRiepilogo';
import TabellaNotifiche from './TabellaNotifiche';

class Riepilogo extends React.Component{
  render(){
    return (
      <div className="mt-3 mb-2">
        <InfoRiepilogo misCorrenti={2} misTotali={96}/>
        <TabellaNotifiche />
        <Grafico
          titolo="Grafico latenza"
          xtitle="volte" //da cambiare
          ytitle="ms"
          label="Ping"
        />
        <Grafico
          titolo="Grafico download"
          xtitle="volte" //da cambiare
          ytitle="Mb/s"
          label="Banda"
        />
        <Grafico
          titolo="Grafico upload"
          xtitle="volte" //da cambiare
          ytitle="Mb/s"
          label="Banda"
        />
      </div>
    )
  }
}

export default Riepilogo;
