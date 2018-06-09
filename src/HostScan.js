import React from 'react';
import Pulsante from './Pulsante';
import $ from 'jquery';

class HostScan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			startHostAddress: '192.168.1.1',
			endHostAddress: '192.168.1.5',
			port: '80',
			timeout: '1000'
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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

		//TODO Implementare la logica di host scan, possibilmente dentro un Worker in un .js dentro /public

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
				<form className = 'form-inline'>
					<div className = 'col-md-10'>
						<div className = 'form-group'>
							<label className = 'horizontal-spacing'>From host: </label>
							<input 
								name = 'startHostAddress'
								className = 'form-control' 
								type = 'text' 
								defaultValue = {this.state.startHostAddress} 
								onChange = {this.handleInputChange}
								size = '10'
							/>
						</div>
						<div className = 'form-group'>
							<label className = 'horizontal-spacing'>To host: </label>
							<input 
								name = 'endHostAddress'
								className = 'form-control' 
								type = 'text' 
								defaultValue = {this.state.endHostAddress}
								onChange = {this.handleInputChange}
								size = '10'
							/>
						</div>
						<div className = 'form-group'>
							<label className = 'horizontal-spacing'>Port: </label>
							<input 
								name = 'port'
								className = 'form-control' 
								type = 'text' 
								defaultValue = {this.state.port} 
								onChange = {this.handleInputChange}
								size = '5'
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
					<div className = 'col-md-2'>
						<div className = 'form-group'>
							{/*
							<input type = "submit" value = "Port Scan" className = 'btn-success btn-md btn pr-3 pl-3'/>
							*/}
							<Pulsante 
								align = 'text-xs-center'
								buttonColorClass = 'btn-outline-danger btn-md' 
								buttonCaption = 'Host Scan' 
								buttonId = 'hostScanButton' 
								onClick = {this.handleSubmit} 
							/>
						</div>
					</div>

				</form>
			</div>
		);
	}
}

export default HostScan;