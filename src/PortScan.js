import React from 'react';
import Pulsante from './Pulsante';
import $ from 'jquery';

class PortScan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			startPort: '75',
			endPort: '85',
			hostAddress: '192.168.1.1',
			timeout: '1000'
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		console.log(this.state);
	}

	handleInputChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleSubmit(event) {
		$('#mistButton').attr('disabled', 'disabled');
		$('#portScanButton').attr('disabled', 'disabled');
		$('#hostScanButton').attr('disabled', 'disabled');

		//TODO Implementare la logica di port scan, possibilmente dentro un Worker in un .js dentro /public

		console.log(this.state);
		//Previene il comportamento di default del riaggiornamento della pagina
		event.preventDefault();

		$('#mistButton').removeAttr('disabled');
		$('#portScanButton').removeAttr('disabled');
		$('#hostScanButton').removeAttr('disabled');
	}

	render() {
		return (
			<div className = "container">
				<form className = 'form-inline' onSubmit = {this.handleSubmit}>
					<div className = 'col-md-10'>
						<div className = 'form-group'>
							<label className = 'horizontal-spacing'>From port: </label>
							<input 
								name = 'startPort'
								className = 'form-control' 
								type = 'text' 
								defaultValue = {this.state.startPort} 
								onChange = {this.handleInputChange}
								size = '5'
							/>
						</div>
						<div className = 'form-group'>
							<label className = 'horizontal-spacing'>To port: </label>
							<input 
								name = 'endPort'
								className = 'form-control' 
								type = 'text' 
								defaultValue = {this.state.endPort} 
								onChange = {this.handleInputChange}
								size = '5'
							/>
						</div>
						<div className = 'form-group'>
							<label className = 'horizontal-spacing'>Host IP: </label>
							<input 
								name = 'hostAddress'
								className = 'form-control' 
								type = 'text' 
								defaultValue = {this.state.hostAddress} 
								onChange = {this.handleInputChange}
								size = '10'
							/>
						</div>
						<div className = 'form-group'>	
							<label className = 'horizontal-spacing'>Timeout: </label>
							<input 
								name = 'timeout'
								className = 'form-control' 
								type = 'text' 
								defaultValue = {this.state.timeout} 
								onChange = {this.handleInputChange}
								size = '5'
							/>
						</div>
					</div>
					<div className = 'col-md-2' >
						<div className = 'form-group'>
							{/*
							<input type = "submit" value = "Port Scan" className = 'btn-success btn-md btn pr-3 pl-3'/>
							*/}
							<Pulsante 
								align = 'text-xs-center'
								buttonColorClass = 'btn-outline-success btn-md' 
								buttonCaption = 'Port Scan'
								buttonId = 'portScanButton' 
								onClick = {this.handleSubmit}
							/>
							
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default PortScan;