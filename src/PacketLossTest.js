import React from 'react';
import Pulsante from './Pulsante';
import $ from 'jquery';

class PacketLossTest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			servers: {
				"iceServers": [
				{
					"urls":"turn:192.168.1.100:3478", 
					"username": "user",
					"credential":"pwpwpw"
				}	    
				]
			},
			result: 0
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
		console.log(this.state);
	}

	handleSubmit(event) {
		//Posso usare queste variabili per mandare N pacchetti
		let packetsReturned = 0;
		let packetsToSend = 30;
		let testDone = false;
		let result = 0;

		$('#packetLossButton').attr('disabled', 'disabled');

		this.setState({
			result: result
		});

		event.preventDefault();

		var pc1 = new RTCPeerConnection(this.state.servers);
		var pc2 = new RTCPeerConnection(this.state.servers);

		pc1.onicecandidate = function(event) {
			if(event.candidate) {
				var candidate = event.candidate;
		  	    if(candidate.candidate.indexOf("relay")<0) //Obbliga ad accettare solo candidati di tipo relay (TURN), vedere TrickleICE
		  	    	return;
		  	    pc2.addIceCandidate(candidate);
		  	}
		}

		pc2.onicecandidate = function(event) {
		  	if(event.candidate) {
		  		var candidate = event.candidate;
		  	    if(candidate.candidate.indexOf("relay")<0) //Obbliga ad accettare solo candidati di tipo relay (TURN), vedere TrickleICE
		  	    	return;
		  	    pc1.addIceCandidate(candidate);
		  	}
		}

		run();

		function handleError(error) {
		  	throw error;
		}

		function createDataChannels() {
		    //Creare il data channel in modalità unreliable e unordered
		    var dc1 = pc1.createDataChannel('packetLossTest', {maxRetransmits: 0, ordered: true});

		    dc1.onopen = function() {
		    	console.log('pc1: data channel open');

		    	dc1.onmessage = function(event) {
		    		console.log('pc1: received pong');
		    		dc1.send('ping');
		    	}
		    };

		    var dc2;
		    pc2.ondatachannel = function(event) {
		    	dc2 = event.channel;
		    	dc2.onopen = function() {
		    		console.log('pc2: data channel open');

		    		if(!testDone) {
		    			let sent = 1;
		    			let ping = setInterval(function() {
		    				if(sent !== packetsToSend) {
		    					console.log('pc2: send #'+sent);
		    					sent++;
		    					dc2.send('pong');
		    				} else {
		    					clearInterval(ping);     
		    					testDone = true;
					            //done();
					            setTimeout(done, 1000);
					            //FIXME I due data channel vengono riaperti prima della chiusura col timeout, e dopo la chiusura chiamando done()
					            //FIXME Tuttavia ciò non rappresenta un problema verificando se il test è stato completato
		        			}
		      			},500);
		    		}

		    		dc2.onmessage = function(event) {
		          	//var data = event.data;
		          	packetsReturned++;
		          	console.log('pc2: ACK Packets = '+packetsReturned);
		      	}
		  	}
		};

		createOffer();
		}

		function createOffer() {
			console.log('pc1: create offer');
			pc1.createOffer(setLocalDescription1, handleError);
		}

		function setLocalDescription1(desc) {
			console.log('pc1: set local description');
		    //console.log(desc);
		    pc1.setLocalDescription(
		    	new RTCSessionDescription(desc),
		    	setRemoteDescription2.bind(null, desc),
		    	handleError
		    	);
		}

		function setRemoteDescription2(desc) {
			console.log('pc2: set remote description');
		    //console.log(desc);
		    pc2.setRemoteDescription(
		    	new RTCSessionDescription(desc),
		    	createAnswer,
		    	handleError
		    	);
		}

		function createAnswer() {
			console.log('pc2: create answer');
			pc2.createAnswer(
				setLocalDescription2,
				handleError
				);
		}

		function setLocalDescription2(desc) {
			console.log('pc2: set local description');
		    //console.log(desc);
		    pc2.setLocalDescription(
		    	new RTCSessionDescription(desc),
		    	setRemoteDescription1.bind(null, desc),
		    	handleError
		    	);
		}

		function setRemoteDescription1(desc) {
			console.log('pc1: set remote description');
		    //console.log(desc);
		    pc1.setRemoteDescription(
		    	new RTCSessionDescription(desc),
		    	wait,
		    	handleError
		    	);
		}

		function run() {
			createDataChannels();
		}

		function wait() {
			console.log('waiting');
		}

		let done = function() {
			pc1.close();
			pc2.close();

		    let packetsLost = packetsToSend - packetsReturned;
		    result = packetsLost / packetsToSend * 100;

			this.setState({
				result: result
			});

		    console.log('Packet Loss: '+result+'%');
		}.bind(this);

		$('#packetLossButton').removeAttr('disabled');
	}

	render() {
		return (
			<div>
				<br/><div className="container">
					<h3>Test di Packet Loss</h3><br/>
					<form className = 'form-inline'>
						<div className="col-sm-8">
							<div className = 'form-group'>
								<label className = 'horizontal-spacing'>TURN Server:</label>
								<input 
									name = 'timeout'
									className = 'form-control' 
									type = 'text' 
									defaultValue = {this.state.servers.iceServers[0].urls} 
									onChange = {this.handleInputChange}
									size = '18'
								/>
							</div>
							<div className = 'form-group'>
								<label className = 'horizontal-spacing'>Username</label>
								<input 
									name = 'timeout'
									className = 'form-control' 
									type = 'text' 
									defaultValue = {this.state.servers.iceServers[0].username} 
									onChange = {this.handleInputChange}
									size = '4'
								/>
							</div>
							<div className = 'form-group'>
								<label className = 'horizontal-spacing'>Password:</label>
								<input 
									name = 'timeout'
									className = 'form-control' 
									type = 'password' 
									defaultValue = {this.state.servers.iceServers[0].credential} 
									onChange = {this.handleInputChange}
									size = '4'
								/>
							</div>
						</div>
						<div className="col-sm-2">
							<div className = 'form-group'>
						        <h1 style={{fontWeight: "lighter"}}>
						          {this.state.result.toFixed(2)}
						          <small className="text-muted" style={{fontWeight: "lighter"}}>
						             %
						          </small>
						        </h1>
					        </div>
						</div>
						<div className = 'col-sm-2'>
							<div className = 'form-group'>
								<Pulsante 
									align = 'text-xs-center'
									buttonColorClass = 'btn-outline-primary btn-md' 
									buttonCaption = 'Start'
									buttonId = 'packetLossButton' 
									onClick = {this.handleSubmit}
								/>
							</div>
						</div>
					</form>	
				</div><hr/>
			</div>
			);
	}
}

export default PacketLossTest;