import React from 'react';
import Pulsante from './Pulsante';
import Gauge from './Gauge';
import ContenitoreValoriMisuraCorrente from './ContenitoreValoriMisuraCorrente';

class MisuraCorrente extends React.Component{
  render(){
    return (
      <div >
        <Gauge
          value={20}
          color={"#295877"}
          backgroundColor={"#ECEFF1"}
          width={360}
          height={220}
          label=""
          valueLabelStyle={{fontWeight: "lighter", fill: "#295877"}}
          minMaxLabelStyle={{fill: "#295877"}}
        />
        <Pulsante />
        <hr />
        <ContenitoreValoriMisuraCorrente
          pingValue={0}
          downloadValue={0}
          uploadValue={0}
        />
        <hr />
      </div>
    )

  }
}

export default MisuraCorrente;
