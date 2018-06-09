import React from 'react';
import Pulsante from './Pulsante';
import Gauge from './Gauge';
import ContenitoreValoriMisuraCorrente from './ContenitoreValoriMisuraCorrente';

class MisuraCorrente extends React.Component {
  render() {
    return (
      <div>
		<Gauge 
			value = {this.props.value} 
			unitMeasure = {this.props.unitMeasure} 
			color = {this.props.gaugeColor} 
			backgroundColor = {"#ECEFF1"} 
			width = {400} height = {260} 
			label = "" 
			valueLabelStyle = {{fill: "#295877"}} 
			minMaxLabelStyle = {{fill: "#295877"}}
		/>
        {(!this.props.isNeMeSysRunning && this.props.areMistTestServersAvailable) && 
		<Pulsante align = 'text-xs-center' buttonId = 'mistButton' onClick = {this.props.onClick} buttonColorClass = 'btn-outline-primary btn-lg' buttonCaption = 'START' />}
        <ContenitoreValoriMisuraCorrente 
			packetsLost = {this.props.packetsLost}
			pingValue = {this.props.pingValue} 
			jitterValue = {this.props.jitterValue}
			downloadValue = {this.props.downloadValue} 
			uploadValue = {this.props.uploadValue}
		/>
      </div>
    );
  }
}

export default MisuraCorrente;
