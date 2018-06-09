import React from 'react';

class Pulsante extends React.Component {
  render() {
    return (
      <div className = {this.props.align}>
        <button
          id={this.props.buttonId}
          className={this.props.buttonColorClass + ' btn pr-3 pl-3'}
          style={{borderRadius: 3}}
          onClick={this.props.onClick}>
            {this.props.buttonCaption}
        </button>
      </div>
    )
  }
}

/*
const Pulsante = (props) => {
  return (
    <div className="text-xs-center">
      <button
        id='mistButton'
        className="btn btn-outline-primary btn-lg pr-3 pl-3"
        style={{borderRadius: 3}}
        onClick={props.onClick}>
          START
      </button>
    </div>
  )
}
*/

export default Pulsante;
