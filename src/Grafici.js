import React from 'react';
import Grafico from './Grafico';

class Grafici extends React.Component {
  render() {
    return (
      <div>
      <h5 className="mt-3">Grafici</h5>
      <Grafico
        titolo="Latenza"
        xtitle="Misurazioni"
        ytitle="ms"
        label="Ping"
        data={this.props.dataPing}
      />
      <Grafico
        titolo="Download"
        xtitle="Misurazioni"
        ytitle="Mb/s"
        label="Banda"
        data={this.props.dataDownload}
      />
      <Grafico
        titolo="Upload"
        xtitle="Misurazioni"
        ytitle="Mb/s"
        label="Banda"
        data={this.props.dataUpload}
      />
      </div>
    )
  }
}

export default Grafici;
