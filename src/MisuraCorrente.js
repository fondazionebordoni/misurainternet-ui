import React from 'react';
import Pulsante from './Pulsante';
import Gauge from './Gauge';
import ContenitoreValoriMisuraCorrente from './ContenitoreValoriMisuraCorrente';
import ContenitoreIconeDiStato from './ContenitoreIconeDiStato';

class MisuraCorrente extends React.Component{
  render(){
    return (
      <div >
        <Gauge
          value={this.props.value}
          unitMeasure={this.props.unitMeasure}
          color={this.props.gaugeColor}
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
        <ContenitoreIconeDiStato
          statoEthernet={this.props.statoEthernet}
          statoCpu={this.props.statoCpu}
          statoRam={this.props.statoRam}
          statoWifi={this.props.statoWifi}

          cardEthernet={this.props.cardEthernet}
          cardCpu={this.props.cardCpu}
          cardRam={this.props.cardRam}
          cardWifi={this.props.cardWifi} 
        />
      </div>
    );
  }
}

export default MisuraCorrente;
