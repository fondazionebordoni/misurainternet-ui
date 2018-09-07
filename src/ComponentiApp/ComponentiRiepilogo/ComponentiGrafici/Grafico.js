import React from 'react';
import { ColumnChart } from 'react-chartkick';
window.Highcharts = require('highcharts');

class Grafico extends React.Component {
  render() {
    return (
      <div className="mb-3">
        <ColumnChart library={{
          xAxis: {
            tickmarkPlacement: 'on'
          },
          title: {
            text: this.props.titolo
          }
        }} xtitle={this.props.xtitle} ytitle={this.props.ytitle} label={this.props.label} data={this.props.data} colors={this.props.colors} />
      </div>
    )

  }
}

export default Grafico