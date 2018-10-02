export function pingCodeWrapper(arrayOfHostNamesAndPorts, times, maxTimeout, serverPorts, measureResultsContainer, nextFunction) {
	let latencyAvgValue;
	let measureResult;

	self.postMessage(JSON.stringify({
		type: 'measure',
		content: {
			'test_type': 'ping'
		}
	}));

	pingTest(arrayOfHostNamesAndPorts, times, maxTimeout, nextFunction);

	/*************Ping multiple servers***************/
	function pingTest(arrayOfHostNamesAndPorts, times, maxTimeout, nextFunction) {
		let currentMeasureResult = [];

		//Inizializza l'array di risultati del test
		for (let i = 0; i < times; i++) {
			let pingObj = {
				type: 'ping',
				start: null,
				byte: 0,
				value: null
			};
			currentMeasureResult.push(pingObj);
		}

		let hostName = arrayOfHostNamesAndPorts[0];
		let hostNameAndPort = hostName + ':' + serverPorts[0];
		let firstPingDone = false;
		let count = 0;
		let totalTime = 0;
		let t0 = 0;
		let timeout;
		let timeoutEventFired = false;
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
			clearTimeout(websocketConnectionFailedTimeout);
			sendPingMessage();
		};

		ws.onclose = function(event) {
			if (event.code != 1000) { // chiusura imprevista della connessione websocket
				//FIXME produce una doppia chiamata a nextFunction
				//handleErrorsOrTimeoutsOrTestFinished();
			}
		};

		ws.onmessage = function() {
			if (timeoutEventFired) {
				return;
			}

			let tf = Date.now();

			//Rimuovo il timeout impostato al momento dell'invio del messaggio in websocket,
			//questo perché ho ricevuto il messaggio di risposta prima che scattasse il timeout
			clearTimeout(timeout);

			//Non ho fatto un primo ping, lo escludo per avere una misura più accurata
			if (!firstPingDone) {
				let firstPingValue = tf - t0;
				firstPingDone = true;
				sendPingMessage();
				//Ho fatto il primo ping e la misura del ping inizia da qui
			} else {
				let latency = tf - t0;
				currentMeasureResult[count].start = (new Date(t0)).toISOString();
				currentMeasureResult[count].value = latency;
				count++;
				totalTime += latency;

				//Il server è stato pingato il numero di volte richiesto
				if (count === times) {
					let pingAvgValue = totalTime / count;

					if (!measureResultsContainer.server) { //primo server che viene pingato
						measureResultsContainer.server = hostName;
						latencyAvgValue = pingAvgValue;
						measureResult = currentMeasureResult;
					} else {
						if (latencyAvgValue && pingAvgValue < latencyAvgValue) {
							measureResultsContainer.server = hostName;
							latencyAvgValue = pingAvgValue;
							measureResult = currentMeasureResult;
						}
					}

					//Funzione per gestire il passaggio a un altro server da pingare oppure all'esecuzione della prossima funzione
					console.log('handle2');
					handleErrorsOrTimeoutsOrTestFinished();

					//Il test non è finito, il server deve essere ancora pingato
				} else {
					sendPingMessage();
				}
			}
		}; //end onmessage

		//Funzione per calcolare il jitter a partire dal valor medio del ping, array dei ping e il numero di ping
		function calculateJitter(pingAvg, pingArray, pingCount) {
			let jitter = 0;

			for (let i = 0; i < pingCount; i++) {
				let diff = (pingArray[i].value - pingAvg);
				jitter += diff * diff;
				//console.log(`Ping #${i+1} ${pingArray[i].value}`);
			}
			jitter /= pingCount;

			return Math.sqrt(jitter);
		}

		//funzione di utilità per gestire errori, timeout oppure la terminazione del test di ping
		function handleErrorsOrTimeoutsOrTestFinished() {
			//Se la connessione websocket non è stata chiusa, viene chiusa [0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED]
			if (ws.readyState < 3) {
				ws.close();
			}

			//ho pingato l'ultimo server della lista di server passata come parametro alla funzione
			if (arrayOfHostNamesAndPorts.length === 1) {
				if (nextFunction && measureResultsContainer.server) {
					measureResultsContainer.tests = measureResultsContainer.tests.concat(measureResult);
					//Messaggio finale con il risultato del test di ping che viene mandato ad App.js, che arriva alla funzione displayResult
					self.postMessage(JSON.stringify({
						type: 'result',
						content: {
							test_type: 'ping',
							//Modificato per inglobare anche il valore del jitter in un solo JSON
							result: {
								ping: latencyAvgValue,
								jitter: calculateJitter(latencyAvgValue, currentMeasureResult, times)
							}
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
			}
			//altrimenti, pingo i server restanti
			else {
				arrayOfHostNamesAndPorts.shift(); //rimuovo l'elemento in testa all'array
				pingTest(arrayOfHostNamesAndPorts, times, maxTimeout, nextFunction);
			}
		} //end handleErrorsOrTimeoutsOrTestFinished function


		//altra funzione di utilità per mandare, tramite websocket, delle stringhe vuote
		function sendPingMessage() {
			t0 = Date.now();
			ws.send('');
			//Il valore di ritorno di setTimeout è l'handle associato al timeout stesso, univoco per ogni chiamata di setTimeout
			timeout = setTimeout(function() {
				timeoutEventFired = true;
				handleErrorsOrTimeoutsOrTestFinished();
			}, maxTimeout);
		} // end sendPingMessage

	} //end pingTest function
}