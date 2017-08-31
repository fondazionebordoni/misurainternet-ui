import React from 'react';
import Grafici from './Grafici';
import InfoRiepilogo from './InfoRiepilogo';
import TabellaNotifiche from './TabellaNotifiche';

class Riepilogo extends React.Component {
  render() {
    return (
      <div className="mt-3 mb-2">
        <InfoRiepilogo misCorrenti={this.props.misCorrenti} misTotali={this.props.misTotali}/>
        <TabellaNotifiche notifiche={this.props.notifiche}/>
        <Grafici dataPing={this.props.dataPing} dataDownload={this.props.dataDownload} dataUpload={this.props.dataUpload}/>
      </div>
    )
  }
}

export default Riepilogo;

/*  titolo="Latenza"
  xtitle="Misurazioni"
  ytitle="ms"
  label="Ping"
  data={[ [1.0, 100.0], [2.0, 60.0]]}
/>
<Grafico
  titolo="Download"
  xtitle="Misurazioni"
  ytitle="Mb/s"
  label="Banda"
  data={[ [1.0, 40.0], [2.0, 30.0]]}
/>
<Grafico
  titolo="Upload"
  xtitle="Misurazioni"
  ytitle="Mb/s"
  label="Banda"
  data={[ [1.0, 30.0], [2.0, 40.0]]}
/> */
