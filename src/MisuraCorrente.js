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
          width={360}
          height={220}
          label=""
          valueLabelStyle={{fontWeight: "lighter"}}
          minMaxLabelStyle={{fontWeight: "lighter"}}
        />
        <Pulsante />
        <hr />
        <ContenitoreValoriMisuraCorrente
          pingValue={0}
          downloadValue={0}
          uploadValue={0}
        />
      </div>
    )

  }
}

export default MisuraCorrente;
