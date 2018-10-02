/************** packetLossTest code wrapper*************/
export function packetLossTest(arrayOfHostNamesAndPorts, packetsToSend, packetFrequency, maxTimeout, serverPorts, measureResultsContainer, nextFunction) {

	self.postMessage(JSON.stringify({
		type: 'measure',
		content: {
			'test_type': 'packetLoss'
		}
	}));

	lossTest(arrayOfHostNamesAndPorts, packetsToSend, packetFrequency, maxTimeout, nextFunction);

	/*************Ping multiple servers***************/
	function lossTest(arrayOfHostNamesAndPorts, packetsToSend, packetFrequency, maxTimeout, nextFunction) {
		let hostName = arrayOfHostNamesAndPorts[0];
		let hostNameAndPort = hostName + ':' + serverPorts[1];

		let packetsLost = 0;
		let pktSent = 0;
		let pktReceived = 0;
		let timeout;
		let timeoutEventFired = false;
		let testFinished = false;

		let ws = new WebSocket('ws://' + hostNameAndPort);

		let websocketConnectionFailedTimeout = setTimeout(function() {
			//Il websocket si trova ancora in stato connecting e non è stata ancora instaurata la connessione
			if (ws.readyState === 0) {
				//Chiamare ws.close() quando non è stata ancora aperta la connessione causa una chiusura del websocket con event code = 1006. 
				//Questa cosa implica la chiamata dell'event handler onclose che a sua volta chiamerà handleErrorsOrTimeoutsOrTestFinished
				ws.close();
			}
		}, 2000);

		ws.onopen = function() {
			//console.log(this);
			//FIXME L'uso dei parametri passati alla funzione principale sembra non essere funzionante dentro gli event handler
			//TODO console.log(packetFrequency);
			//TODO console.log(maxTimeout);
			clearTimeout(websocketConnectionFailedTimeout);
			let interval = setInterval(function() {
				if (pktSent < packetsToSend) {
					pktSent++;
					sendPingMessage();
				} else {
					testFinished = true;
					clearInterval(interval);
				}
			}, 5 /*TODO packetFrequency */);
			let closeDelay = setTimeout(function() {
				handleErrorsOrTimeoutsOrTestFinished();
			}, 4000 /*TODO maxTimeout */);
		};


		ws.onmessage = function() {
			pktReceived++;
		};


		ws.onclose = function(event) {
			if (event.code != 1000) { // chiusura imprevista della connessione websocket
				//FIXME produce una doppia chiamata a nextFunction; Il codice è comunque funzionante commentando la linea
				//handleErrorsOrTimeoutsOrTestFinished();
			}
		};


		function sendPingMessage() {
			ws.send('');
		}


		//funzione di utilità per gestire errori, timeout oppure la terminazione del test di ping
		function handleErrorsOrTimeoutsOrTestFinished() {
			if (ws.readyState < 3) { //se la connessione websocket non è stata chiusa
				ws.close();
			}
			//I pacchetti persi durante il test
			packetsLost = packetsToSend - pktReceived;

			//ho pingato l'ultimo server della lista di server passata come parametro alla funzione
			if (arrayOfHostNamesAndPorts.length === 1) {
				if (nextFunction && measureResultsContainer.server) {
					//Messaggio finale con il risultato del test di ping che viene mandato ad App.js, che arriva alla funzione displayResult
					self.postMessage(JSON.stringify({
						type: 'result',
						content: {
							test_type: 'packetLoss',
							result: packetsLost / packetsToSend * 100
						}
					}));
					nextFunction();
					return;
				} else if (!measureResultsContainer.server) {
					self.postMessage(JSON.stringify({
						type: 'error',
						content: 1235
					}));
				}

				//altrimenti, pingo i server restanti
			} else {
				arrayOfHostNamesAndPorts.shift(); //rimuovo l'elemento in testa all'array
				lossTest(arrayOfHostNamesAndPorts, packetsToSend, packetFrequency, maxTimeout, nextFunction);
			}
		} //end handleErrorsOrTimeoutsOrTestFinished function
	} //end lossTest function
}
/************** packetLossTest code wrapper*************/
