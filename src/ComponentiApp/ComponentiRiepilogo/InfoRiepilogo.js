import React from 'react';

class InfoRiepilogo extends React.Component {
  render() {
    return (
      <div>
        <p>Sono state eseguite {this.props.misCorrenti} misurazioni su 96.</p>
      </div>
    )
  }
}

export default InfoRiepilogo;