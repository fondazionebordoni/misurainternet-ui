import React from 'react';
import IconaStatoSistema from './IconaStatoSistema';
import ValoreMisuraCorrente from './ValoreMisuraCorrente'

class ContenitoreIconeDiStato extends React.Component {
  render() {
    return (
      <div id="status" className=" ">
        <div className="row">
          <IconaStatoSistema card={this.props.cardEthernet} stato={this.props.statoEthernet} type="ETHERNET"/>
          <IconaStatoSistema card={this.props.cardCpu} stato={this.props.statoCpu} type="CPU"/>
          <IconaStatoSistema card={this.props.cardRam} stato={this.props.statoRam} type="RAM"/>
          <IconaStatoSistema card={this.props.cardWifi} stato={this.props.statoWifi} type="WIFI"/>
        </div>
        {/*<hr />*/}
      </div>
    )
  }
}

export default ContenitoreIconeDiStato;
