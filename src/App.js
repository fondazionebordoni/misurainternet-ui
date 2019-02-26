import React from 'react';
import Intestazione from './Intestazione';
import MisuraCorrente from './MisuraCorrente';
import PacketLossTest from './PacketLossTest';
import NetNeutrality from './NetNeutrality';
import Riepilogo from './Riepilogo';
import Notifica from './Notifica';
import ContenitoreIconeDiStato from './ContenitoreIconeDiStato';
import $ from 'jquery';

//se non si collega a nemesis all'avvio faccio partire mist.

//var res = [];
//var client_id = null;
var listelements = [];
var count = 0; //Aggiunta mia
var stringResult = ''; //Aggiunta mia
var numOfTests = 1;

//Per evitare warning/errori nella console, vedere componentDidMount()
const disableNemesis = true;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.mistClientId = null;
		this.state = {
			mistTestServers: [],
			licenceInfo: ' ',
			isNeMeSysRunning: true,
			mostra: true,
			valore: 0,
			misCorrenti: 0,

			hdr: 'MisuraInternet UI',
			par: <p>Interfaccia web per il monitoraggio della qualità degli accessi ad Internet da postazione fissa realizzato da AGCOM in collaborazione con la Fondazione Ugo Bordoni ed il supporto dell’Istituto Superiore delle Comunicazioni.</p>,

			unitMeasure: '',
			gaugeColor: '#0275d8',
			packetsLost: 0,
			pingValue: 0,
			jitterValue: 0,
			downloadValue: 0,
			uploadValue: 0,
			notifiche: [],

			statoEthernet: '-',
			statoCpu: '-',
			statoRam: '-',
			statoWifi: '-',

			cardEthernet: '',
			cardCpu: '',
			cardRam: '',
			cardWifi: ' ',

			dataPing: null,
			dataJitter: null,
			dataUpload: null,
			dataDownload: null
		};

		this.componentDidMount = this.componentDidMount.bind(this);
		this.updateTachometer = this.updateTachometer.bind(this);
		this.readMessage = this.readMessage.bind(this);
		this.displayTestN = this.displayTestN.bind(this);
		this.profilation = this.profilation.bind(this);
		this.displayMeasureView = this.displayMeasureView.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleMISTResults = this.handleMISTResults.bind(this);
		this.handleWebSocketErrors = this.handleWebSocketErrors.bind(this);
		this.resetMeasureResults = this.resetMeasureResults.bind(this);
	}

	resetMeasureResults() {
		this.setState({
			unitMeasure: '',
			gaugeColor: '#0275d8',
			packetsLost: 0,
			pingValue: 0,
			jitterValue: 0,
			downloadValue: 0,
			uploadValue: 0,
			valore: 0,
		});
	}

	handleClick() {
		this.resetMeasureResults();

		$('#mistButton').attr('disabled', 'disabled');
		$('#portScanButton').attr('disabled', 'disabled');
		$('#hostScanButton').attr('disabled', 'disabled');

		let startMISTMsg = {
			request: 'startMeasure',
			servers: this.state.mistTestServers
		};

		//TODO Put speedtest.js (bundle.js) in misurainternet-speedtest by using ->
		//TODO -> https://stackoverflow.com/questions/11211068/web-worker-loading-of-absolute-url
		
		//Il file contiene il bundle di speedtest.js (effettuato con webpack), che richiede metodi da altri file dentro /public/js/
		let worker = new Worker(process.env.PUBLIC_URL + '/build/bundle.js');

		worker.postMessage(JSON.stringify(startMISTMsg));

		worker.onmessage = function(message) {
			this.readMessage(JSON.parse(message.data));
		}.bind(this);
	}

	/*TODO  -> https://stackoverflow.com/questions/11211068/web-worker-loading-of-absolute-url
	getRemoteSpeedtestCode() {
		let worker; //= new Worker('http://xyz/FSWorker.js');

		let xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost/Speedtest/speedtest.js');	//TODO localhost or a variable with server IP
		xhr.responseType = 'blob';

		xhr.onload = function(e) {
		    let blob = this.response;
		    worker = new Worker(window.URL.createObjectURL(blob));
		    fs_ready(); // do more stuff here
		};

		xhr.send(null);
	}
	*/

	handleMISTResults(measureResults) {
		measureResults = {
			measure: measureResults
		};
		if (this.mistClientId && this.mistClientId.length > 0) {
			measureResults.measure.serial = this.mistClientId;
			var jsonResultData = JSON.stringify(measureResults);
			var ajax_sendMISTMeasures_settings = {
				'async': true,
				'url': 'https://www.misurainternet.it/set_measures/?type=speedtest',
				'method': 'POST',
				'headers': {
					'cache-control': 'no-cache',
					'content-type': 'application/json'
				},
				'data': jsonResultData,
			};
			$.ajax(ajax_sendMISTMeasures_settings);
		}

		count++; //Aggiunta mia
		console.log(count);
		//Il numero di test da effettuare premendo start
		if (count < numOfTests) {
			setTimeout(this.handleClick(), 6000);
		} else console.log(stringResult);
		this.displayEndView();
	}

	handleWebSocketErrors() {
		this.setState({
			isNeMeSysRunning: false
		});
		this.displayError(1234);
		this.resetMeasureResults();

		var ajax_getMISTSerial_settings = {
			'async': true,
			'crossDomain': true,
			'url': 'https://www.misurainternet.it/get_serial/?type=speedtest',
			'method': 'GET',
			'headers': {
				'cache-control': 'no-cache'
			}
		};

		$.ajax(ajax_getMISTSerial_settings).done(function(response) {
			this.mistClientId = response.serial;
			this.displayWaitView(this.mistClientId);
		}.bind(this));

		var ajax_getMISTServers_settings = {
			'async': true,
			'url': 'https://www.misurainternet.it/get_servers/?type=speedtest',
			'method': 'GET',
			'headers': {
				'cache-control': 'no-cache',
			}
		};

		$.ajax(ajax_getMISTServers_settings).done(function(response) {
			var arrayOfServers = [];
			for (var i = 0; i < response.servers.length; i++) {
				arrayOfServers.push((response.servers[i].ip + ':' + response.servers[i].port));
			}
			this.setState({
				mistTestServers: arrayOfServers
			});
		}.bind(this));
	}

	componentDidMount() {
		//var ws = new WebSocket('ws://localhost:8080'); // -> SERVER DI TEST

		if (disableNemesis) {
			//this.handleWebSocketErrors();
			this.setState({
				isNeMeSysRunning: false
			});
			this.displayError(1234);
			this.resetMeasureResults();
			return;
		}

		var ws = new WebSocket('ws://localhost:54201/ws');

		ws.onopen = function() {
			var req = {
				request: 'currentstatus'
			};
			this.send(JSON.stringify(req));
		};

		ws.onmessage = function(message) {
			var msg = JSON.parse(message.data);
			this.readMessage(msg);
		}.bind(this);

		ws.onclose = function(event) {
			/*Se la chiusura del websocket è causata da un errore allora viene eseguito MIST*/
			if (event.code !== 1000) {
				this.handleWebSocketErrors();
			}
		}.bind(this);
	}

	readMessage(msg) {
		switch (msg.type) {
		case 'sys_resource':
			this.sysResource(msg.content.resource, msg.content.state, msg.content.info);
			break;
		case 'wait':
			this.displayWaitView(msg.serial, msg.content.message, msg.content.seconds);
			break;
		case 'end':
			this.displayEndView();
			break;
		case 'notification':
			this.displayNotification(msg.content.error_code, msg.content.message);
			break;
		case 'error':
			this.displayError(msg.content);
			break;
		case 'measure':
			this.displayMeasureView(msg.content.test_type, msg.content.bw);
			break;
		case 'tachometer':
			this.updateTachometer(msg.content.value, msg.content.message);
			break;
		case 'profilation':
			this.profilation(msg.content.done);
			break;
		case 'result':
			this.displayResult(msg.content.test_type, msg.content.result, msg.content.error);
			break;
		case 'test':
			this.displayTestN(msg.content.n_test, msg.content.n_tot, msg.content.retry);
			break;
		case 'speedtest': //MIST ha terminato di effettuare le misure
			this.handleMISTResults(msg);
			break;
		default:
			console.log('Wrong message');
		}
	}

	displayNotification(error_code, message) {
		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		if (h < 10) {
			h = '0' + h;
		}
		if (m < 10) {
			m = '0' + m;
		}

		//var n = Math.ceil(Math.random() * 100000); //Round a number upward to its nearest integer.
		//var collapse = 'collapse' + n;
		//var heading = 'heading' + n;

		listelements.push(
			<li className="list-group-item">
				<Notifica text={h + ':' + m + '-' + message + '(codice errore: ' + error_code + ')'}/>
			</li>
		);

		if (listelements.length > 10) {
			listelements.splice(0, 1); //limito a 10 la lista di notifiche mostrate nella pagina
		}
		this.setState({
			notifiche: listelements.reverse()
		});
	}

	displayResult(test_type, result, error) {
		this.setState({
			valore: 0
		});
		if (error) {
			this.setState({
				par: 'Test di ' + test_type + ' fallito: ' + error + '. Nuovo tentativo fra pochi secondi...'
			});
		} else {
			switch (test_type) {
			case 'ping':
				this.setState({
					par: 'Valore misurato: ' + result.ping.toFixed(2) + ' ms'
				});
				this.setState({
					pingValue: result.ping.toFixed(2),
					jitterValue: result.jitter.toFixed(2)
				});
				stringResult = stringResult.concat('avg: ' + result.ping.toFixed(2) + '\tmdev: ' + result.jitter.toFixed(2) + '\t');
				console.log('ping: ' + result.ping.toFixed(2) + ' jitter: ' + result.jitter.toFixed(2));
				break;

			case 'packetLoss':
				this.setState({
					packetsLost: result.toFixed(2)
				});
				stringResult = stringResult.concat('loss: ' + result.toFixed(2) + '%\t');
				console.log('loss: ' + result.toFixed(2) + '%');
				break;

			case 'download':
				this.setState({
					par: 'Valore misurato: ' + (result / 1000).toFixed(2) + ' Mbit/s'
				});
				this.setState({
					downloadValue: (result / 1000).toFixed(2)
				});
				stringResult = stringResult.concat((result / 1000).toFixed(2) + '\t');
				console.log((result / 1000).toFixed(2));
				break;

			case 'upload':
				this.setState({
					par: 'Valore misurato: ' + (result / 1000).toFixed(2) + ' Mbit/s'
				});
				this.setState({
					uploadValue: (result / 1000).toFixed(2)
				});
				stringResult = stringResult.concat((result / 1000).toFixed(2) + '\n');
				console.log((result / 1000).toFixed(2));
				break;

			default:
				break;
			}
		}
	}

	writeFile(value) {
		const fs = require('fs');

		fs.appendFile('test/test.txt', value, (err) => {
			if (err) throw err;
		});
	}

	updateTachometer(value, message) {
		if (!this.state.isNeMeSysRunning && message && (message.info || message.warning)) {
			if (message.warning) {
				this.setState({
					par: <p><b>Attenzione! </b>{message.warning}</p>
				});
			} else {
				this.setState({
					par: <p>{message.info}</p>
				});
			}
		}
		this.setState({
			valore: value.toFixed(2)
		});
	}

	displayTestN(n_test, n_tot, retry) {
		if (retry === 'True') {
			this.setState({
				par: 'Misura ripresa dopo l\'interruzione. Test ' + n_test + ' di ' + n_tot + '.'
			});
		} else {
			this.setState({
				par: 'Test ' + n_test + ' di ' + n_tot + '.'
			});
		}
	}

	profilation(done) {
		$(document).ready(function() {
			$('#status').slideDown('slow');
		});
		//this.setState({mostra: false});
		if (done === 'False') {
			this.setState({
				cardEthernet: ''
			});
			this.setState({
				cardCpu: ''
			});
			this.setState({
				cardRam: ''
			});
			this.setState({
				cardWifi: ''
			});
			this.setState({
				par: 'Profilazione in corso...'
			});
		} else {
			//this.setState({mostra: true});
		}
	}

	sysResource(resource, state, info) {
		switch (state) {
		case 'error':
			switch (resource) {
			case 'ethstatus':
				this.setState({
					statoEthernet: 'Errore'
				});
				this.setState({
					cardEthernet: 'card-danger'
				});
				break;
			case 'cpustatus':
				this.setState({
					statoCpu: 'Errore'
				});
				this.setState({
					cardCpu: 'card-danger'
				});
				break;
			case 'ramstatus':
				this.setState({
					statoRam: 'Errore'
				});
				this.setState({
					cardRam: 'card-danger'
				});
				break;
			case 'wifistatus':
				this.setState({
					statoWifi: 'Errore'
				});
				this.setState({
					cardWifi: 'card-danger'
				});
				break;
			default:
				break;
			}
			break;
		case 'ok':
			switch (resource) {
			case 'ethstatus':
				this.setState({
					statoEthernet: 'OK'
				});
				this.setState({
					cardEthernet: 'card-success'
				});
				break;
			case 'cpustatus':
				this.setState({
					statoCpu: 'OK'
				});
				this.setState({
					cardCpu: 'card-success'
				});
				break;
			case 'ramstatus':
				this.setState({
					statoRam: 'OK'
				});
				this.setState({
					cardRam: 'card-success'
				});
				break;
			case 'wifistatus':
				this.setState({
					statoWifi: 'OK'
				});
				this.setState({
					cardWifi: 'card-success'
				});
				break;
			default:
				break;
			}
			break;
		default:
			break;
		}
	}

	displayWaitView(serial, message, seconds) {
		//MIST:
		//on error->
		//in modalità speed test, l' utente può tornare in modalità nemesys ricaricando la pagina
		//richiedere il seriale
		if (this.state.isNeMeSysRunning) {
			this.setState({
				hdr: 'Nemesys è in attesa di effettuare una nuova misura.'
			});
			this.setState({
				par: message
			});

			$(document).ready(function() {
				$('#status').slideUp('slow');
			});
		}


		if (serial && serial.length > 0) {
			//se non ho il seriale, nascondo i componenti dei Grafici
			//in caso di errore fai sparire la parte sotto MisuraCorrente

			this.setState({
				dataPing: 'https://www.misurainternet.it/get_client_detail/?serial=' + serial + '&type=ping'
			});
			//this.setState({dataPing: [[0, 12],[1, 19]]});
			this.setState({
				dataDownload: 'https://www.misurainternet.it/get_client_detail/?serial=' + serial + '&type=download'
			});
			//this.setState({dataDownload: [ [1.0, 100.0], [2.0, 60.0]]});
			this.setState({
				dataUpload: 'https://www.misurainternet.it/get_client_detail/?serial=' + serial + '&type=upload'
			});
			//this.setState({dataUpload: [ [1.0, 100.0], [2.0, 60.0]]});

			if (this.state.isNeMeSysRunning) {
				var settingsNumMeasures = {
					'async': true,
					'crossDomain': true,
					'url': 'https://www.misurainternet.it/get_client_detail/?serial=' + serial + '&type=numMeasures',
					'method': 'GET',
					'headers': {
						'cache-control': 'no-cache'
					}
				};

				var settingsLicenceInfo = {
					'async': true,
					'crossDomain': true,
					'url': 'https://www.misurainternet.it//get_client_detail/?serial=' + serial + '&type=licenseInfo',
					'method': 'GET',
					'headers': {
						'cache-control': 'no-cache'
					}
				};

				$.ajax(settingsNumMeasures).done(function(response) {
					this.setState({
						misCorrenti: response.numMeasures
					});
				}.bind(this));

				$.ajax(settingsLicenceInfo).done(function(response) {
					this.setState({
						licenceInfo: response.licenseInfo
					});
				}.bind(this));

			}
		}
	}

	displayEndView() {
		if (!this.state.isNeMeSysRunning) {
			this.setState({
				hdr: 'MisuraInternet Speedtest'
			});
			this.setState({
				par: <p>
					<b>Le misurazioni sono state completate. </b>
            Puoi effettuare una nuova misurazione cliccando sul tasto START. Qualora volessi riprendere ad effettuare le misurazioni con Nemesys, <a href="/">clicca qui</a>
				</p>,
				unitMeasure: '',
				gaugeColor: '#0275d8',
			});
			$('#mistButton').removeAttr('disabled');
			$('#portScanButton').removeAttr('disabled');
			$('#hostScanButton').removeAttr('disabled');
		} else {
			this.setState({
				hdr: 'Nemesys ha terminato le sue misurazioni'
			});
			this.setState({
				par: 'Le misurazioni sono state completate. Accedi all\'area personale per scaricare il certificato.'
			});
		}
	}

	displayMeasureView(test_type, bw) {
		this.setState({
			hdr: 'Nemesys - Misurazione in corso'
		});
		this.setState({
			par: 'Inizio test...'
		});

		switch (test_type) {
		case 'upload':
			this.setState({
				gaugeColor: '#28a745'
			});
			this.setState({
				hdr: 'Test di upload in corso...'
			});
			this.setState({
				unitMeasure: 'Mb/s'
			});
			break;
		case 'download':
			this.setState({
				gaugeColor: '#007bff'
			});
			this.setState({
				hdr: 'Test di download in corso...'
			});
			this.setState({
				unitMeasure: 'Mb/s'
			});
			break;
		case 'ping':
			this.setState({
				gaugeColor: '#ffc107'
			});
			this.setState({
				hdr: 'Test di latenza in corso...'
			});
			this.setState({
				unitMeasure: 'ms'
			});
			break;
		case 'packetLoss':
			this.setState({
				gaugeColor: '#ffc107'
			});
			this.setState({
				hdr: 'Test di packet loss in corso...'
			});
			this.setState({
				unitMeasure: '%'
			});
			break;
		default:
			this.setState({
				hdr: 'Errore imprevisto'
			});
		}
	}

	displayError(errorMsg) {

		switch (errorMsg) {
		case 1006:
			document.getElementById('titolo').innerHTML = 'Nemesys - Errore';
			this.setState({
				hdr: 'Impossibile connettersi a Nemesys'
			});
			this.setState({
				par: <p>
					<b>Assicurati di aver scaricato ed installato Nemesys: una volta completata l&#039; installazione, potrai vedere l&#039; avanzamento delle tue misure su questa pagina.</b>
					<br/><br/>
                Se hai già installato Nemesys e visualizzi questa schermata, prova a riavviare il computer.
					<br/><br/>Qualora continuassi a visualizzare questo messaggio, l&#039; installazione o l&#039; avvio di Nemesys potrebbero non essere andati a buon fine:
					<a href="/supporto/">
                  contatta il nostro helpdesk.</a>
				</p>
			});
			break;
		case 1234: //Errore connessione websocket
			document.getElementById('titolo').innerHTML = 'MisuraInternet Speedtest';
			this.setState({
				hdr: 'MisuraInternet Speedtest',
				par: <p>
					<b>Nemesys non è al momento operativo oppure non è installato. </b>
                  Puoi effettuare una misurazione tramite Misurainternet Speedtest premendo sul tasto START. In alternativa <a href="/">clicca qui</a> per riprendere le misurazioni con Nemesys.
				</p>,
				dataPing: null,
				dataUpload: null,
				dataDownload: null
			});
			this.resetMeasureResults();
			break;
		case 1235: //Errore nell'esecuzione del test di ping in MIST
			this.setState({
				hdr: 'MisuraInternet Speedtest - Errore',
				par: <p>
					<b>Errore nel test di ping. </b>
                  Puoi effettuare nuovamente la misurazione con MisuraInternet Speedtest cliccando sul tasto START. Qualora volessi riprendere ad effettuare le misurazioni con Nemesys, <a href="/">clicca qui</a>
				</p>
			});
			this.resetMeasureResults();
			$('#mistButton').removeAttr('disabled');
			$('#portScanButton').removeAttr('disabled');
			$('#hostScanButton').removeAttr('disabled');
			break;
		case 1236: //Errore nell'esecuzione del test di download in MIST
			this.setState({
				hdr: 'MisuraInternet Speedtest - Errore',
				par: <p>
					<b>Errore nel test di download. </b>
                  Puoi effettuare nuovamente la misurazione con MisuraInternet Speedtest cliccando sul tasto START. Qualora volessi riprendere ad effettuare le misurazioni con Nemesys, <a href="/">clicca qui</a>
				</p>
			});
			this.resetMeasureResults();
			$('#mistButton').removeAttr('disabled');
			$('#portScanButton').removeAttr('disabled');
			$('#hostScanButton').removeAttr('disabled');
			break;
		case 1237: //Errore nell'esecuzione del test di upload in MIST
			this.setState({
				hdr: 'MisuraInternet Speedtest - Errore',
				par: <p>
					<b>Errore nel test di upload. </b>
                  Puoi effettuare nuovamente la misurazione con MisuraInternet Speedtest cliccando sul tasto START. Qualora volessi riprendere ad effettuare le misurazioni con Nemesys, <a href="/">clicca qui</a>
				</p>
			});
			this.resetMeasureResults();
			$('#mistButton').removeAttr('disabled');
			$('#portScanButton').removeAttr('disabled');
			$('#hostScanButton').removeAttr('disabled');
			break;
		case 1238: //Errore che viene notificato quando, durante il test di download e upload, la prequalifica restituisce sempre zero (assenza di connessione)
			this.setState({
				hdr: 'MisuraInternet Speedtest - Errore',
				par: <p>
					<b>Errore! Assenza di connessione ad internet. Controlla la tua connessione internet. </b>
                  Puoi effettuare nuovamente la misurazione con MisuraInternet Speedtest cliccando sul tasto START. Qualora volessi riprendere ad effettuare le misurazioni con Nemesys, <a href="/">clicca qui</a>
				</p>
			});
			this.resetMeasureResults();
			$('#mistButton').removeAttr('disabled');
			$('#portScanButton').removeAttr('disabled');
			$('#hostScanButton').removeAttr('disabled');
			break;
		default:
			this.setState({
				par: errorMsg
			});
		}

		this.setState({
			mostra: false
		});
	}


	render() {
		return (
			<div>
				<Intestazione hdr = {this.state.hdr} licenceInfo = {this.state.licenceInfo} par = {this.state.par}/>
				{this.state.isNeMeSysRunning && <ContenitoreIconeDiStato statoEthernet = {this.state.statoEthernet} statoCpu = {this.state.statoCpu} statoRam = {this.state.statoRam} statoWifi = {this.state.statoWifi} cardEthernet = {this.state.cardEthernet} cardCpu = {this.state.cardCpu} cardRam = {this.state.cardRam} cardWifi = {this.state.cardWifi}/>}
				<MisuraCorrente
					onClick = {this.handleClick} 
					areMistTestServersAvailable = {this.state.mistTestServers} 
					isNeMeSysRunning = {this.state.isNeMeSysRunning} 
					value = {this.state.valore} 
					unitMeasure = {this.state.unitMeasure} 
					gaugeColor = {this.state.gaugeColor} 
					packetsLost = {this.state.packetsLost}
					pingValue = {this.state.pingValue}
					jitterValue = {this.state.jitterValue}
					downloadValue = {this.state.downloadValue} 
					uploadValue = {this.state.uploadValue}
				/>
				<PacketLossTest/>
				<NetNeutrality/>
				{(this.state.isNeMeSysRunning || (this.state.dataPing && this.state.dataDownload && this.state.dataUpload)) && 
				<Riepilogo 
		        	isNeMeSysRunning = {this.state.isNeMeSysRunning} 
		        	misCorrenti = {this.state.misCorrenti} 
		        	dataPing = {this.state.dataPing}
		        	dataDownload = {this.state.dataDownload} 
		        	dataUpload = {this.state.dataUpload} 
		        	notifiche = {this.state.notifiche}
        		/>}
			</div>
		);
	}
}


export default App;
