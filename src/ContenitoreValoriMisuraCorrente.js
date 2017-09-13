import React from 'react';
import ValoreMisuraCorrente from './ValoreMisuraCorrente'

class ContenitoreValoriMisuraCorrente extends React.Component {
  render() {
    return (
      <div>
        <hr/>
        <div className="row text-xs-center">
          <ValoreMisuraCorrente icon="fa-exchange" header="Ping" value={this.props.pingValue} unit="ms"/>
          <ValoreMisuraCorrente icon="fa-cloud-download" header="Download" value={this.props.downloadValue} unit="Mb/s"/>
          <ValoreMisuraCorrente icon="fa-cloud-upload" header="Upload" value={this.props.uploadValue} unit="Mb/s"/>
        </div>
        <hr className="hidden-xs-down" />
      </div>
    )

  }
}


export default ContenitoreValoriMisuraCorrente;
