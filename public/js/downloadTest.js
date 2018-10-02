import {closeAllConnections, handleDownloadAndUploadErrors} from './utilities';

export function downloadTest(host, bytesToDownload, numberOfStreams, timeout, threshold, gaugeUpdateInterval, serverPorts, measureResultsContainer, nextFunction) {
	let testStartTime = Date.now();
	let previouslyDownloadedBytes = 0;
	let previousDownloadTime = testStartTime;
	let prevInstSpeedInMbs = 0;
	let downloadedBytes = 0;
	let testDone = false;
	let xhrArray = [];
	let firstInterval;
	let secondInterval;
	let measureResult = {
		type: 'download',
		start: (new Date(testStartTime)).toISOString(),
		byte: null,
		value: null
	};

	self.postMessage(JSON.stringify({
		type: 'measure',
		content: {
			test_type: 'download'
		}
	}));

	let k = 0;
	let downloadHostAndPorts = [];

	serverPorts.forEach(function(item, index) {
		downloadHostAndPorts[index] = host + ':' + item;
	});

	for (let i = 0; i < numberOfStreams; i++) {
		if (k >= downloadHostAndPorts.length)
			k = 0;
		downloadStream(i, i * 100, downloadHostAndPorts[k]);
		k++;
	}

	firstInterval = setInterval(function() {
		let tf = Date.now();
		let deltaTime = tf - previousDownloadTime;
		let currentlyDownloadedBytes = downloadedBytes;
		let deltaByte = currentlyDownloadedBytes - previouslyDownloadedBytes;
		let instSpeedInMbs = (deltaByte * 8 / 1000.0) / deltaTime;
		let percentDiff = Math.abs((instSpeedInMbs - prevInstSpeedInMbs) / instSpeedInMbs); //potrebbe anche essere negativo

		self.postMessage(JSON.stringify({
			type: 'tachometer',
			content: {
				value: instSpeedInMbs,
				message: {
					info: 'Prequalifica in corso. Attendere prego ...'
				}
			}
		}));

		previousDownloadTime = tf;
		previouslyDownloadedBytes = currentlyDownloadedBytes;
		prevInstSpeedInMbs = instSpeedInMbs;

		if (percentDiff < threshold || (tf - testStartTime > 10000)) {
			let testWarning = false;
			if (tf - testStartTime > 10000) {
				if (instSpeedInMbs === 0) {
					handleDownloadAndUploadErrors(firstInterval, secondInterval, xhrArray);

					self.postMessage(JSON.stringify({
						type: 'error',
						content: 1238
					}));
					return;
				}
				testWarning = true;
			}
			let measureStartTime = Date.now();
			downloadedBytes = 0;
			clearInterval(firstInterval);

			secondInterval = setInterval(function() {
				let time = Date.now();
				let downloadTime = time - measureStartTime;
				let downloadedBytesAtThisTime = downloadedBytes;
				let downloadSpeedInMbs = (downloadedBytesAtThisTime * 8 / 1000) / downloadTime;
				if (testWarning) {
					self.postMessage(JSON.stringify({
						type: 'tachometer',
						content: {
							value: downloadSpeedInMbs,
							message: {
								warning: 'La tua connessione non risulta essere particolarmente stabile. Pertanto il risultato del test di download potrebbe non essere del tutto accurato'
							}
						}
					}));
				} else {
					self.postMessage(JSON.stringify({
						type: 'tachometer',
						content: {
							value: downloadSpeedInMbs,
							message: {
								info: 'Misurazione in corso...'
							}
						}
					}));
				}

				if ((time - measureStartTime) >= timeout) {
					closeAllConnections(xhrArray);
					clearInterval(secondInterval);
					testDone = true;
					let totalTime = (time - testStartTime) / 1000.0;
					let measureTime = time - measureStartTime;
					let downloadSpeedInKbs = downloadSpeedInMbs * 1000;
					measureResult.byte = downloadedBytesAtThisTime;
					measureResult.value = measureTime;
					measureResultsContainer.tests.push(measureResult);
					self.postMessage(JSON.stringify({
						type: 'result',
						content: {
							test_type: 'download',
							result: downloadSpeedInKbs
						}
					}));

					//esegui, se presente, la successiva funzione
					if (nextFunction) {
						nextFunction();
						return;
					}
				}
			}, 500 /*TODO this.gaugeUpdateInterval*/ );
		}
	}, 3000);

	/*****download stream function*******/
	function downloadStream(index, delay, host) {
		setTimeout(function() {

			if (testDone) {
				return;
			}

			let req = {
				request: 'download',
				data_length: bytesToDownload
			};

			let jsonReq = JSON.stringify(req);
			let url = 'http://' + host + '?r=' + Math.random() + '&data=' + encodeURIComponent(jsonReq);

			let prevLoadedBytes = 0;
			let xhr = new XMLHttpRequest();
			xhrArray[index] = xhr;

			xhrArray[index].onprogress = function(event) {
				addBytes(event.loaded);
			};

			xhrArray[index].onerror = function(event) {
				handleDownloadAndUploadErrors(firstInterval, secondInterval, xhrArray);

				self.postMessage(JSON.stringify({
					type: 'error',
					content: 1236
				}));
			};

			xhrArray[index].onload = function(event) {
				xhrArray[index].abort();
				addBytes(event.loaded);
				downloadStream(index, 0, host);
			};

			xhrArray[index].onabort = function(event) {
				addBytes(event.loaded);
			};

			function addBytes(newTotalBytes) {
				let loadedBytes = newTotalBytes <= 0 ? 0 : (newTotalBytes - prevLoadedBytes);
				downloadedBytes += loadedBytes;
				prevLoadedBytes = newTotalBytes;
			}

			xhrArray[index].responseType = 'arraybuffer';
			xhrArray[index].open('GET', url);
			xhrArray[index].send();
		}, delay);
	}
	/*****end download stream function*******/
}
