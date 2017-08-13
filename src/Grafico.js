import React from 'react';
import { LineChart } from 'react-chartkick';
window.Highcharts = require('highcharts');

class Grafico extends React.Component{
  render(){
    return (
      <div>
        <h5 className="mb-2">{this.props.titolo}</h5>
        <LineChart xtitle={this.props.xtitle} ytitle={this.props.ytitle} label={this.props.label} data={[ [1.0, 11.0], [2.0, 6.0]]} />      </div>
      )

    }
  }

  Grafico.propTypes = {
    titolo: React.PropTypes.string,
    xtitle: React.PropTypes.string,
    ytitle: React.PropTypes.string,
    //aggiungere poi la prop 'data'
    label: React.PropTypes.string
  };

  export default Grafico
