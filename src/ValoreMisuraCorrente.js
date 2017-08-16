import React from 'react';

class ValoreMisuraCorrente extends React.Component{
  render(){
    return (
      <div className="col-xs-4">
        <p className="text-xs-center">
          <i
            className={"fa " + this.props.icon}
            style={
              {
                marginRight: 7
              }
            }
            aria-hidden="true">
          </i>
          {this.props.header}
        </p>
        <h1 style={{fontWeight: "lighter"}}>
          {this.props.value}
          <small
            className="text-muted"
            style={{fontWeight: "lighter"}}>
            {" " +this.props.unit}
          </small>
        </h1>
    </div>
  );
  }
}

ValoreMisuraCorrente.propTypes = {
  icon: React.PropTypes.string,
  header: React.PropTypes.string,
  value: React.PropTypes.number,
  unit: React.PropTypes.string
};

export default ValoreMisuraCorrente;
