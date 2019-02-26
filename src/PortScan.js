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
			timeout: '1000',
			result: ''
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.resetMeasureResults = this.resetMeasureResults.bind(this);
		//console.log(this.state);
	}

	handleInputChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	resetMeasureResults() {
		this.setState({
			result: ''
		});
	}

	handleSubmit(event) {
		$('#mistButton').attr('disabled', 'disabled');
		$('#portScanButton').attr('disabled', 'disabled');
		$('#hostScanButton').attr('disabled', 'disabled');

		this.resetMeasureResults();

		//console.log(this.state);
		//Previene il comportamento di default del riaggiornamento della pagina
		event.preventDefault();

		//TODO Implementare la logica di port scan, possibilmente dentro un Worker in un .js dentro /public
		//Possibile spostare la logica in un js separato dall'interfaccia?
		//let worker = new Worker(process.env.PUBLIC_URL + '/js/portScanBundle.js');

		//npm ha un package react-websocket che permette di usare un component <WebSocket> e mount/unmount per connettersi
		let ws = new WebSocket('ws://localhost:60200');

		ws.onopen = function() {
			let scanRequest = {
				testType: 'portScan',
				target: this.state.hostAddress,
				startPort: this.state.startPort,
				endPort: this.state.endPort,
				timeout: this.state.timeout
			};
			ws.send(JSON.stringify(scanRequest));
		}.bind(this);

		ws.onmessage = function(message) {
			//TODO inviare i risultati della scansione in tempo reale, ed un messaggio di terminazione del test
			let msg = JSON.parse(message.data);
			this.setState({
				result: msg
			});
			console.log(msg);
			ws.close();
		}.bind(this);

		ws.onclose = function(event) {
			//TODO distinguere se la chiusura è avvenuta lato client o per via di un errore lato server
			console.log('Chiusa connessione websocket al server python');
			//Eventuale error handling per chiusura inaspettata della connessione WebSocket
			/*if (event.code !== 1000) {
				console.log(event);
				//this.handleWebSocketErrors();
			}*/
		};

		$('#mistButton').removeAttr('disabled');
		$('#portScanButton').removeAttr('disabled');
		$('#hostScanButton').removeAttr('disabled');
	}

	render() {
		return (
			<div className = "container">
				<h3>Port Scanner in Python (TCP)</h3><br/>
				<form className = 'form-inline' onSubmit = {this.handleSubmit}>
					<div className = 'col-md-10'>
						<div className = 'form-group'>
							<label className = 'horizontal-spacing'>From port </label>
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
							<label className = 'horizontal-spacing'>To port </label>
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
							<label className = 'horizontal-spacing'>Host IP </label>
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
							<label className = 'horizontal-spacing'>Timeout </label>
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
								buttonCaption = 'Start'
								buttonId = 'portScanButton' 
								onClick = {this.handleSubmit}
							/>
						</div>
					</div>
				</form>
				<div className = 'col-md-12' >
					<h2 style={{fontWeight: "lighter"}}>
						<small className="text-muted" >
							Porte aperte: {this.state.result}
						</small>
					</h2>
				</div>
			</div>
		);
	}
}

export default PortScan;