import React from 'react';

class IconaStatoSistema extends React.Component {
  render() {
    return (
      <div className={"px-2 col-sm-3"}>
        <div className={"pt-1 text-xs-center card card-inverse " + this.props.card}>
          <h5 style={{
            fontWeight: "lighter"
          }}>
            {"" + this.props.type}
          </h5>
          <div>
            <h5 style={{
              fontWeight: "lighter"
            }}>
              {this.props.stato}
            </h5>
          </div>
        </div>
      </div>
    )
  }
}

export default IconaStatoSistema;