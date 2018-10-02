import React from 'react';
import Pulsante from './Pulsante';
import $ from 'jquery';

/* 
	This code is derived from Javascript Port Scanner by Nestor Garcia (img scan): http://jsscan.sourceforge.net/
	It is also derived from JSRecon by Attack and Defense Labs (xhr scan): http://www.andlabs.org/tools/jsrecon.html
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
			method: 'img',
			startTime: '',
			xhr: null
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleMethodSelection = this.handleMethodSelection.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		//this.scanXhr = this.scanXhr.bind(this);
		this.scanImg = this.scanImg.bind(this);
	}

	handleInputChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleMethodSelection(event) {
		this.setState({
			method: event.target.value
		});
	}

	handleSubmit(event) {
		$('#mistButton').attr('disabled', 'disabled');
		$('#portScanButton').attr('disabled', 'disabled');
		$('#hostScanButton').attr('disabled', 'disabled');

		this.setState({
			result: []
		});

		//TODO Implementare la logica di host scan, possibilmente dentro un Worker in un .js dentro /public

		//console.log(this.state);
		//Previene il comportamento di default del riaggiornamento della pagina
		event.preventDefault();

		let startPort = parseInt(this.state.startPort, 10);
		let endPort = parseInt(this.state.endPort, 10);
		let timeout = parseInt(this.state.timeout, 10);

		this.performScan(this.state.method, this.state.hostAddress, startPort, endPort, timeout);

		$('#mistButton').removeAttr('disabled');
		$('#portScanButton').removeAttr('disabled');
		$('#hostScanButton').removeAttr('disabled');
	}

	//TODO Ho fatto un tentativo di rendere la funzione parallela con async/await e le Promise
	//TODO Tuttavia React non accetta Promise come oggetti nello state, vedere Suspense (late 2018, ora alpha):
	//https://blog.logrocket.com/async-rendering-in-react-with-suspense-5d0eaac886c8
	//https://github.com/facebook/react/issues/6481#issuecomment-388666290
	performScan(method, host, start, end, timeout) {
		let result = [];
		let i;
		let port;

		switch(method) {
			case 'XHR':
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
	}

	scanImg(host, port, timeout) {
		var src;
		var id = String(Math.floor(Math.random()*10000000000));
		this.getid = function() {return id};

		var img = new Image();

		img.onerror = function () {
			if (!img) return;
			img = undefined;
			console.log(port+' up');
			let newResult = this.state.result;
			newResult.push(port+' ');
			this.setState({
				result: newResult
			});
		}.bind(this);

		img.onload = img.onerror;

		switch(port) {
	        case 21:  src = 'ftp://' + this.id() + '@' + host + '/'; break;//ftp
	        case 25:  src = 'mailto://' + this.getid() + '@' + host ; break;//smtp **
	        case 70:  src = 'gopher://' + host + '/'; break;//gopher
	        case 119: src = 'news://' + host + '/'; break;//nntp **
	        case 443: src = 'https://' + host + '/' + this.getid() + '.jpg'; break;
	        default:  src = 'http://' + host + ':' + port + '/' + this.getid() + '.jpg'; break;// getid is here to prevent cache seekings;
     	}

     	img.src = src;
	    setTimeout(function () {
	    	if (!img) return;
	    	img = undefined;
	    	console.log(port+' down');
	    }, timeout);
	};

	/*FIXME Lo scan XHR Non funziona, sembra richiedere che l'endpoint risponda, altrimenti va in log un errore
	scanXhr(host, port, timeout) {
		let xhr;
		this.scan_ports_xhr(host, port, timeout, xhr);
		let d = new Date();
		console.log('D.GETTIME = '+d.getTime());
		this.setState({
			startTime: d.getTime()
		})
	}

	scan_ports_xhr(host, port, timeout, xhr) {
		if(is_blocked(port))
		{
			log(port + "  - blocked port");
			setTimeout("scan_ports_xhr()",1);
			return;
		}
		try {
			xhr = new XMLHttpRequest();
			xhr.open('GET', "http://" + host + ":" + port);
			xhr.send();
			setTimeout(this.check_ps_xhr(host, port, timeout, xhr), 5);
		} catch(err) {
			console.log(err);
		}  
	}

	check_ps_xhr(host, port, timeout, xhr) {
		let d = new Date();
		var interval = d.getTime() - this.state.startTime;
		console.log('start ' +this.state.startTime);
		console.log(interval);
		if (xhr.readyState === 1) {
			if (interval > timeout) {
				console.log(port + " - time exceeded");
				//ps_timeout_ports.push(port);
				//setTimeout(this.scan_ports_xhr(host, port, timeout, xhr), 1);
			} else {
				//setTimeout(this.check_ps_xhr(host, port, timeout, xhr), 5);
			}
		} else {
			if (interval < timeout) {
				console.log(port + " - open");
				//ps_open_ports.push(port);
				let newResult = this.state.result;
				newResult.push(port+' ');
				this.setState({
					result: newResult
				});
				return;
			} else {
				console.log(port + " - closed");
				//ps_closed_ports.push(port);
			}
			//setTimeout(this.scan_ports_xhr(host, port, timeout, xhr), 1);
		//}
	}
	*/

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
					<div className = 'col-md-1' >
						<div className = 'form-group'>
							<table>
							    <tbody>
			                    	<tr>
				                        <td><input type="radio" name="site_name" 
				                                   value='XHR'
				                                   disabled
				                                   checked={this.state.method === 'XHR'} 
				                                   onChange={this.handleMethodSelection} />XHR</td>
			                    	</tr>
			                    	<tr>
				                        <td><input type="radio" name="address" 
				                                   value='img'  
				                                   checked={this.state.method === 'img'} 
				                                   onChange={this.handleMethodSelection} />img</td>
			                    	</tr>
		               			</tbody>
		               		</table>
	               		</div>
               		</div>
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
					Porte aperte: {this.state.result}
				</div>
			</div>
		);
	}
}

export default HostScan;