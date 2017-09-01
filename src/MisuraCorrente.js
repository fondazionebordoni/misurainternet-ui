import React from 'react';
import Pulsante from './Pulsante';
import Gauge from './Gauge';
import ContenitoreValoriMisuraCorrente from './ContenitoreValoriMisuraCorrente';

class MisuraCorrente extends React.Component {
  render() {
    return (
      <div >
        <Gauge value={this.props.value} unitMeasure={this.props.unitMeasure} color={this.props.gaugeColor} backgroundColor={"#ECEFF1"} width={360} height={220} label="" valueLabelStyle={{
          fill: "#295877"
        }} minMaxLabelStyle={{
          fill: "#295877"
        }}/>
        {this.props.speedtest==="MIST" && <Pulsante/>}
        <ContenitoreValoriMisuraCorrente pingValue={this.props.pingValue} downloadValue={this.props.downloadValue} uploadValue={this.props.uploadValue}/>
      </div>
    );
  }
}

export default MisuraCorrente;
