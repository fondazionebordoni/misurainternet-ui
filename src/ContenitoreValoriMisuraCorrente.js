import React from 'react';
import ValoreMisuraCorrente from './ValoreMisuraCorrente'

class ContenitoreValoriMisuraCorrente extends React.Component {
  render() {
    return (
      <div>
        <hr/>
        <div className="row text-xs-center">
          <ValoreMisuraCorrente col="3" icon="fa-exchange" header="Ping" value={this.props.pingValue} unit="ms"/>
		      <ValoreMisuraCorrente col="3" icon="fa-bar-chart" header="Jitter" value={this.props.jitterValue} unit="ms"/>
		      {/*<ValoreMisuraCorrente col="2" icon="fa-exclamation-triangle" header="Packet Loss" value={this.props.packetsLost} unit="%"/>*/}
          <ValoreMisuraCorrente col="3" icon="fa-cloud-download" header="Download" value={this.props.downloadValue} unit="Mb/s"/>
          <ValoreMisuraCorrente col="3" icon="fa-cloud-upload" header="Upload" value={this.props.uploadValue} unit="Mb/s"/>
        </div>
        <hr/>
      </div>
    )

  }
}


export default ContenitoreValoriMisuraCorrente;
