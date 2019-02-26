/*
	This code is derived from: speedtest_worker.js by Federico Dossena
	Licensed under the GNU LGPL license version 3,
	Original version:
		-> https://github.com/adolfintel/speedtest/blob/master/speedtest_worker.js
*/

import {pingCodeWrapper} from './pingCodeWrapper';
//Il test di packet loss con websocket usa TCP, non rilevando pacchetti persi (vengono ritrasmessi)
//import {packetLossTest} from './packetLossTest';
import {downloadTest} from './downloadTest'; 
import {uploadTest} from './uploadTest';

/*************Global variables****************/
let measureResultsContainer = {
	type: 'speedtest',
	version: '3.0.0',
	server: null,
	start: null,
	stop: null,
	tests: [],
};

const serverPorts = ['60100', '60101', '60102', '60103', '60104', '60105', '60106', '60107', '60108', '60109'];

const useCustomTestServer = true;
//const customTestServerIP = ['18.222.201.233'];
const customTestServerIP = ['localhost']; //Put here your custom IP

workerListener();

/************ worker listener **************/
function workerListener() {
	self.onmessage = function(message) {
		if (useCustomTestServer) {
			startSpeedtest(customTestServerIP);
		} else {
			let req = JSON.parse(message.data);
			if (req.request && req.request === 'startMeasure' && req.servers && req.servers.length > 0) {
				startSpeedtest(req.servers);
			}
		}
	};
}
/************END worker listener **********/

function startSpeedtest(arrayOfServers) {
	const m50 = 52428800;	//50MB
	const m1 = 1048576;
	const m5 = 5242880;
	const m10 = 5242880 * 2;
	const m25 = m50 / 2;
	const m20 = m5 * 4;
	const m30 = m10 * 3;
	const m80 = m10 * 8;
	const m100 = m50 * 2;

	measureResultsContainer.start = (new Date()).toISOString();

	//Ping settings
	const timesToPing = 10;
	const pingMaxTimeout = 1000; //ms

	//Packet loss settings
	const lossTestPacketCount = 50;
	//TODO Questi due parametri non vengono considerati da setInterval e setTimeout -> https://stackoverflow.com/questions/18963377/use-variable-as-time-in-setinterval-settimeout
	const lossTestPacketFrequency = 300;//ms
	const lossTestTimeout = 4500;

	//Download/Upload settings
	const gaugeUpdateInterval = 500;//ms, frequenza di aggiornamento dei grafici (funziona?)
	const bytesToDownload = m50; //50MB
	const bytesToUpload = m50; //50MB
	const numberOfDownloadStreams = 20;
	const numberOfUploadStreams = 20;
	const downloadTestTimeout = 10000; //ms
	const uploadTestTimeout = 10000; //ms
	const downloadTestThreshold = 0.10;
	const uploadTestThreshold = 0.10;

	//Evitare callback hell con l'uso di Promise/Async-Await
	pingCodeWrapper(	
		arrayOfServers, 
		timesToPing, 
		pingMaxTimeout, 
		serverPorts, 
		measureResultsContainer, 
		/*function() {
			packetLossTest(	
				arrayOfServers, 
				lossTestPacketCount, 
				lossTestPacketFrequency, 
				lossTestTimeout,
				serverPorts,
				measureResultsContainer,*/
				function() {
					downloadTest(	
						measureResultsContainer.server, 
						bytesToDownload, 
						numberOfDownloadStreams, 
						downloadTestTimeout, 
						downloadTestThreshold, 
						gaugeUpdateInterval,
						serverPorts,
						measureResultsContainer,
						function() {
							uploadTest(	
								measureResultsContainer.server, 
								bytesToUpload, 
								numberOfUploadStreams, 
								uploadTestTimeout, 
								uploadTestThreshold, 
								gaugeUpdateInterval, 
								serverPorts,
								measureResultsContainer,
								terminateWorker
							);
						}
					);
				}
			);
		//}
	//);
}


function terminateWorker() {
	measureResultsContainer.stop = (new Date()).toISOString();
	self.postMessage(JSON.stringify(measureResultsContainer));
	self.close();
}
