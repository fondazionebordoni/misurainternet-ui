import React from 'react';
import Pulsante from './Pulsante';
import $ from 'jquery';

/* 
	This code is derived from Javascript Port Scanner by Nestor Garcia: http://jsscan.sourceforge.net/
*/

class HostScan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			startPort: '75',
			endPort: '85',
			hostAddress: '192.168.1.1',
			timeout: '1000',
			result: [],
			testType: 'xhr',
			startTime: ''
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.scanXhr = this.scanXhr.bind(this);
		this.scanImg = this.scanImg.bind(this);
		this.generateUncachedUrl = this.generateUncachedUrl.bind(this);
		this.resetMeasureResults = this.resetMeasureResults.bind(this);
		this.updateResult = this.updateResult.bind(this);
	}

	handleInputChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	resetMeasureResults() {
		this.setState({
			result: []
		});
	}

	handleSubmit(event) {
		$('#mistButton').attr('disabled', 'disabled');
		$('#portScanButton').attr('disabled', 'disabled');
		$('#hostScanButton').attr('disabled', 'disabled');

		this.resetMeasureResults();

		//TODO Implementare la logica di host scan, possibilmente dentro un Worker in un .js dentro /public
		//Previene il comportamento di default del riaggiornamento della pagina
		event.preventDefault();

		let startPort = parseInt(this.state.startPort, 10);
		let endPort = parseInt(this.state.endPort, 10);
		let timeout = parseInt(this.state.timeout, 10);

		this.performScan(this.state.testType, this.state.hostAddress, startPort, endPort, timeout);

		$('#mistButton').removeAttr('disabled');
		$('#portScanButton').removeAttr('disabled');
		$('#hostScanButton').removeAttr('disabled');
	}

	//TODO Ho fatto un tentativo di rendere la funzione parallela con async/await e le Promise
	//TODO Tuttavia React non accetta Promise come oggetti nello state, vedere Suspense (late 2018, ora alpha):
	//https://blog.logrocket.com/async-rendering-in-react-with-suspense-5d0eaac886c8
	//https://github.com/facebook/react/issues/6481#issuecomment-388666290
	performScan(testType, host, start, end, timeout) {
		let result = [];
		let i;
		let port;

		switch(testType) {
			case 'xhr':
				i = 0;
				for(port = start; port <= end; port++) {
					result[i] = this.scanXhr(host, port, timeout);
					i++;
				}
				console.log('done');
				break;
			case 'img':
				i = 0;
				for(port = start; port <= end; port++) {
					result[i] = this.scanImg(host, port, timeout);
					i++;
				}
				console.log('done');
				break;
			default: 
				break;
		}
		//console.log(result);	//TODO Viene stampato un oggetto vuoto subito, il risultato arriva dopo l'istruzione dentro scanImg
	}

	scanImg(host, port, timeout) {
		let img = new Image();
		let src = this.generateUncachedUrl(host, port);

		img.onerror = function () {	//TODO La funzione stampa nella console dei browser net::ERR_CONNECTION_TIMED_OUT, come fare l'handling?
			if (!img) return;
			img = undefined;
			console.log(port+' up');
			this.updateResult(port);
			//return port;	//TODO Servirebbe un meccanismo Promise-based
		}.bind(this);

		img.onload = img.onerror;

     	img.src = src;
	    setTimeout(function () {
	    	//Si ottiene net::ERR_CONNECTION_TIMED_OUT ogni volta che una connessione fallisce
	    	if (!img) return;
	    	img = undefined;
	    	console.log(port+' down');
	    	return;
	    }, timeout);
	};

	scanXhr(host, port, timeout) {
		let req = new XMLHttpRequest();
		let src = this.generateUncachedUrl(host, port);

		req.onerror = function () {	//TODO La funzione stampa nella console dei browser net::ERR_CONNECTION_TIMED_OUT, come fare l'handling?
			if (!req) return;
			req = undefined;
			//console.log(req.status);
			console.log(port+' up');
			this.updateResult(port);
			//return port;	//TODO Servirebbe un meccanismo Promise-based
		}.bind(this);

		req.onload = req.onerror;	

		req.open('GET', src);
		req.send();	

	    setTimeout(function () {
	    	//Si ottiene net::ERR_CONNECTION_TIMED_OUT ogni volta che una connessione fallisce
	    	if (!req) return;
	    	req = undefined;
	    	console.log(port+' down');
	    	return;
	    }, timeout);
	}

	generateUncachedUrl(host, port) {
		let url;
		let randomId = String(Math.floor(Math.random()*10000000000));
		this.getid = function() {return randomId};

		switch(port) {
	        case 21:  url = 'ftp://' + this.getid() + '@' + host + '/'; break;//ftp
	        case 25:  url = 'mailto://' + this.getid() + '@' + host ; break;//smtp **
	        case 70:  url = 'gopher://' + host + '/'; break;//gopher
	        case 119: url = 'news://' + host + '/'; break;//nntp **
	        case 443: url = 'https://' + host + '/' + this.getid() + '.jpg'; break;
	        default:  url = 'http://' + host + ':' + port + '/' + this.getid() + '.jpg'; break;// getid is here to prevent cache seekings;
		 }
		 
     	return url;
	}

	updateResult(newPort) {
		//Non si deve modificare direttamente lo state con un'operazione su result, perché potrebbe creare problemi:
		//https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs
		let newResult = this.state.result;
		newResult.push(newPort + ' ');
		this.setState({
			result: newResult
		});

		/* TODO modo alternativo di aggiornare il risultato della scansione, push() è più veloce
		this.setState({
			result: [...this.state.result, newPort]
		}); */		
	}

	render() {
		return (
			<div className = "container">
				<h3>Port Scanner in Javascript (HTTP)</h3><br/>
				<form className = 'form-inline' onSubmit = {this.handleSubmit}>
					<div className = 'col-md-9'>
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
					{// Selettore 'radio' per metodo di port scan (xhr o img)
					<div className = 'col-md-1' >
						<div className = 'form-group'>
							<table>
							    <tbody>
			                    	<tr>
				                        <td><input type="radio" name="testType" 
				                                   value='xhr'
				                                   //disabled
				                                   checked={this.state.testType === 'xhr'} 
				                                   onChange={this.handleInputChange} />xhr</td>
			                    	</tr>
			                    	<tr>
				                        <td><input type="radio" name="testType" 
				                                   value='img'  
				                                   checked={this.state.testType === 'img'} 
				                                   onChange={this.handleInputChange} />img</td>
			                    	</tr>
		               			</tbody>
		               		</table>
	               		</div>
               		</div>
               		}
					<div className = 'col-md-2' >
						<div className = 'form-group'>
							{/*
							<input type = "submit" value = "Port Scan" className = 'btn-success btn-md btn pr-3 pl-3'/>
							*/}
							<Pulsante 
								align = 'text-xs-center'
								buttonColorClass = 'btn-outline-danger btn-md' 
								buttonCaption = 'Start'
								buttonId = 'hostScanButton' 
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

export default HostScan;