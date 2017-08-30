import React from 'react';

class Notifica extends React.Component {
  render() {
    return(
      <div className="text-danger">{this.props.text}</div>
    )
  }
}

export default Notifica;
