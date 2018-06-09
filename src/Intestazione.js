import React from 'react';

class Intestazione extends React.Component {
	render() {
		return (
			<div className={"mb-2"}>
		      <h2>{this.props.hdr}</h2>
		      <div id="licence">{this.props.licenceInfo}</div>   
		      {this.props.par}
		    </div>
		)
	}
}

/*
const Intestazione = (props) => {
  return (
    <div className={"mb-2"}>
      <h2>{props.hdr}</h2>
      <div id="licence">{props.licenceInfo}</div>   
      {props.par}
    </div>
  )
}
*/

export default Intestazione;
