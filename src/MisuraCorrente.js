  import React from 'react';
  import Pulsante from './Pulsante';
  import Gauge from './Gauge';
  import ContenitoreValoriMisuraCorrente from './ContenitoreValoriMisuraCorrente';

  class MisuraCorrente extends React.Component{
    render(){
      return (
        <div >
          <Gauge
            value={this.props.value}
            color={"#0275d8"}
            backgroundColor={"#ECEFF1"}
            width={360}
            height={220}
            label=""
            valueLabelStyle={{fill: "#295877"}}
            minMaxLabelStyle={{fill: "#295877"}}
          />
          <Pulsante />
          <ContenitoreValoriMisuraCorrente
            pingValue={this.props.pingValue}
            downloadValue={this.props.downloadValue}
            uploadValue={this.props.uploadValue}
          />
        </div>
      )

    }
  }

  export default MisuraCorrente;
