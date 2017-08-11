import React from 'react';

class InfoRiepilogo extends React.Component {
  render() {
    return (
      <div>
      <h2>Informazioni di riepilogo</h2>
      <p>Sono state eseguite {this.props.misCorrenti} misurazioni su {this.props.misTotali}</p>
      </div>
    )
  }
}

export default InfoRiepilogo;
