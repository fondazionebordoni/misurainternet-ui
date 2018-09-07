import React from 'react';

class ValoreMisuraCorrente extends React.Component {
  render() {
    return (
      <div className="col-sm-4">
        <h6 className="text-xs-center mb-1">
          <i className={"fa " + this.props.icon} style={{
            marginRight: 7
          }} aria-hidden="true"></i>
          {this.props.header}
        </h6>
        <h1 style={{
          fontWeight: "lighter"
        }}>
          {this.props.value}
          <small className="text-muted" style={{
            fontWeight: "lighter"
          }}>
            {" " + this.props.unit}
          </small>
        </h1>
        <hr className="hidden-sm-up" />
      </div>
    );
  }
}

export default ValoreMisuraCorrente;