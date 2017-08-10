import React from 'react';
import Pulsante from './Pulsante';
import Gauge from './Gauge';

class MisuraCorrente extends React.Component{
  render(){
    return (
      <div >
        <div className="text-xs-center" >
        <Gauge  value={0}  color={"#33ccff"}  width={360} height={220} label="" />
        </div>
        <Pulsante />
      </div>
    )

  }
}

export default MisuraCorrente;
