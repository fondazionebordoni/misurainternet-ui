import React from 'react';
import Grafici from './ComponentiRiepilogo/Grafici';
import InfoRiepilogo from './ComponentiRiepilogo/InfoRiepilogo';
import TabellaNotifiche from './ComponentiRiepilogo/TabellaNotifiche';

class Riepilogo extends React.Component {
  render() {
    return (
      <div className="mt-3 mb-2">
        <h3>Informazioni di riepilogo</h3>
        {this.props.isNeMeSysRunning && <InfoRiepilogo misCorrenti={this.props.misCorrenti} />}
        {this.props.isNeMeSysRunning && <TabellaNotifiche notifiche={this.props.notifiche} />}
        <Grafici dataPing={this.props.dataPing} dataDownload={this.props.dataDownload} dataUpload={this.props.dataUpload} />
      </div>
    )
  }
}

export default Riepilogo;