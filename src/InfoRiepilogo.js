import React from 'react';

class InfoRiepilogo extends React.Component {
  render() {
    return (
      <div>
        <h3>Informazioni di riepilogo</h3>
        <p>Sono state eseguite {this.props.misCorrenti}
          misurazioni su {this.props.misTotali}</p>
      </div>
    )
  }
}

export default InfoRiepilogo;
