import React from 'react';
import Grafico from './ComponentiGrafici/Grafico';

class Grafici extends React.Component {
  render() {
    return (
      <div>
        <h5 className="mt-3">Grafici</h5>
        <Grafico titolo="Latenza" xtitle="Misurazioni" ytitle="ms" label="Ping" data={this.props.dataPing} colors={["#ffc107"]}/>
        <Grafico titolo="Download" xtitle="Misurazioni" ytitle="Mb/s" label="Banda" data={this.props.dataDownload} colors={["#007bff"]}/>
        <Grafico titolo="Upload" xtitle="Misurazioni" ytitle="Mb/s" label="Banda" data={this.props.dataUpload} colors={["#28a745"]}/>
      </div>
    )
  }
}

export default Grafici;
