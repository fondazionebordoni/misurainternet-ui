  import React from 'react';

  class IconaStatoSistema extends React.Component{
    render(){
      return (
        <div className={"text-xs-center col-sm-3 card card-inverse " + this.props.card } >
          <h5
            style={{fontWeight: "lighter"}}>
            {"" + this.props.type }
          </h5>
          <div>
          <h5
            style={{fontWeight: "lighter"}}>
            {this.props.stato}
          </h5>
        </div>
      </div>
      )
    }
  }

  export default IconaStatoSistema;


  /*<div className="card card-inverse card-success col-sm-3 ">
    <large
      style={{fontWeight: "lighter"}}>
      {" " +this.props.type + this.props.stato}
    </large>
      <i
        className={"fa " + this.props.iconaStato}
        style={
          {
            marginLeft: 7
          }
        }
        aria-hidden="true">
      </i>

</div>
*/
