import React from 'react';

class Grafico extends React.Component{
  render(){
    return (
      <div>
        <h5>{this.props.titolo}</h5>
        <div></div>
      </div>
    )

  }
}

Grafico.propTypes = {
  titolo: React.PropTypes.string
};

export default Grafico
