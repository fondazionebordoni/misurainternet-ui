import React from 'react';
import Pulsante from './Pulsante';
import $ from 'jquery';

class PacketLossTest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			config: {
				'iceServers': [
				{
					'urls':'turn:127.0.0.1:3478', 
					'username': 'utente',
					'credential':'password'
				}	    
				]
			},
			packetsToSend: 30,
			result: 0
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event) {
		//console.log(event.target);
		switch(event.target.name) {
			case 'urls':
			case 'username':
			case 'credential':
				let configCopy = JSON.parse(JSON.stringify(this.state.config));
				configCopy.iceServers[0][event.target.name] = event.target.value;
				this.setState({
				      'config': configCopy 
				}); 
				break;
			default:
				this.setState({
					[event.target.name]: event.target.value
				});
		}
		//console.log(this.state);
	}

	handleSubmit(event) {
		//Posso usare queste variabili per mandare N pacchetti
		let packetsReceived = 0;
		let packetsToSend = this.state.packetsToSend;	//Utilizzare 30 come valore per il test
		//let packetsInterval = 500; //Manda un pacchetto ogni 500ms tramite setInterval()
		let testDone = false;
		let result = 0;

		$('#packetLossButton').attr('disabled', 'disabled');

		this.setState({
			result: result
		});

		event.preventDefault();

		var pc1 = new RTCPeerConnection(this.state.config);
		var pc2 = new RTCPeerConnection(this.state.config);

		pc1.onicecandidate = function(event) {
			if(event.candidate) {
				var candidate = event.candidate;
		  	    if(candidate.candidate.indexOf('relay')<0) //Obbliga ad accettare solo candidati di tipo relay (TURN), vedere TrickleICE
		  	    	return;
		  	    pc2.addIceCandidate(candidate);
		  	}
		}

		pc2.onicecandidate = function(event) {
		  	if(event.candidate) {
		  		var candidate = event.candidate;
		  	    if(candidate.candidate.indexOf('relay')<0) //Obbliga ad accettare solo candidati di tipo relay (TURN), vedere TrickleICE
		  	    	return;
		  	    pc1.addIceCandidate(candidate);
		  	}
		}

		run();

		function handleError(error) {
		  	throw error;
		}

		function createDataChannels() {
			//Il peer 2 invia i pacchetti al peer 1 mediante il server di relay, simulando un ping
		    //Creare il data channel in modalità unreliable e unordered
		    var dc1 = pc1.createDataChannel('packetLossTest', {
				//Per mandare pacchetti UDP (con la stessa semantica) serve specificare maxRetransmits a 0 e ordered false
		    	maxRetransmits: 0, 
		    	ordered: false
		    	//maxPacketLifeTime: 2000	//TODO Testare se e come si può impostare il timeout dei pacchetti e che effetto ha sul risultato
		    });	

		    dc1.onopen = function() {
		    	console.log('pc1: data channel open');

		    	dc1.onmessage = function(event) {
		    		//Il peer 1 è il downlink, e conta i pacchetti ricevuti
		    		console.log('pc1: received ping');
		    		//dc1.send('pong');	//Non serve mandare di nuovo pacchetti indietro, si avrebbero duplicati
					packetsReceived++;
		    	}
		    };

		    var dc2;
		    pc2.ondatachannel = function(event) {
		    	dc2 = event.channel;
		    	dc2.onopen = function() {
		    		console.log('pc2: data channel open');

		    		if(!testDone) {
		    			let packetsSent = 1;
		    			//Invio di n messaggi con intervallo prestabilito
		    			let ping = setInterval(function() {
		    				if(packetsSent <= packetsToSend) {
		    					console.log('pc2: send #'+packetsSent);
		    					packetsSent++;
		    					dc2.send('ping');
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
		    			//Il peer 2 manda solamente pacchetti in uplink, non riceverà niente
			          	//var data = event.data;
			          	//packetsReceived++;
			          	//console.log('pc2: ACK Packets = '+packetsReceived);
			          	console.log('dc2 msg received');
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

		    let packetsLost = packetsToSend - packetsReceived;
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
				<br/><div className='container'>
					<h3>Test di Packet Loss</h3><br/>
					<form className = 'form-inline'>
						<div className='col-sm-10'>
							<div className = 'form-group'>
								<label className = 'horizontal-spacing'>TURN Server</label>
								<input 
									name = 'urls'
									className = 'form-control' 
									type = 'text' 
									defaultValue = {this.state.config.iceServers[0].urls} 
									onChange = {this.handleInputChange}
									size = '18'
								/>
							</div>
							<div className = 'form-group'>
								<label className = 'horizontal-spacing'>Username</label>
								<input 
									name = 'username'
									className = 'form-control' 
									type = 'text' 
									defaultValue = {this.state.config.iceServers[0].username} 
									onChange = {this.handleInputChange}
									size = '4'
								/>
							</div>
							<div className = 'form-group'>
								<label className = 'horizontal-spacing'>Password</label>
								<input 
									name = 'credential'
									className = 'form-control' 
									type = 'password' 
									defaultValue = {this.state.config.iceServers[0].credential} 
									onChange = {this.handleInputChange}
									size = '4'
								/>
							</div>
							<div className = 'form-group'>
								<label className = 'horizontal-spacing'>Nr. of packets</label>
								<input 
									name = 'packetsToSend'
									className = 'form-control' 
									type = 'text' 
									defaultValue = {this.state.packetsToSend} 
									onChange = {this.handleInputChange}
									size = '1'
								/>
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
						<div className='col-sm-12'>
							<div className = 'form-group'>
						        <h2 style={{fontWeight: 'lighter'}}>
								  <small className="text-muted" >
								    Packet Loss: {this.state.result.toFixed(2)}%
								  </small>
						        </h2>
					        </div>
						</div>
					</form>	
				</div><hr/>
			</div>
			);
	}
}

export default PacketLossTest;