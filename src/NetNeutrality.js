import React from 'react';
import PortScan from './PortScan';
import HostScan from './HostScan';

class NetNeutrality extends React.Component {

	//TODO Aggiungere un React Component che gestisca i risultati dei test (possibilmente durante l'esecuzione e non alla fine)

	render() {
		return (
			<div>
				<br/>
				<PortScan/>
				<br/><hr/><br/>
				<HostScan/>
				<br/><hr/>
			</div>
		);
	}
}

export default NetNeutrality;