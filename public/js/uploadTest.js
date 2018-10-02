import {closeAllConnections, handleDownloadAndUploadErrors, generateTestData} from './utilities';

export function uploadTest(host, bytesToUpload, numberOfStreams, timeout, threshold, gaugeUpdateInterval, serverPorts, measureResultsContainer, nextFunction) {
	let testStartTime = Date.now();
	let previouslyUploadedBytes = 0;
	let previousUploadTime = testStartTime;
	let prevInstSpeedInMbs = 0;
	let testData = generateTestData(bytesToUpload / (Math.pow(1024, 2)));
	let uploadedBytes = 0;
	let testDone = false;
	let xhrArray = [];
	let firstInterval;
	let secondInterval;
	let measureResult = {
		type: 'upload',
		start: (new Date(testStartTime)).toISOString(),
		byte: null,
		value: null
	};

	self.postMessage(JSON.stringify({
		type: 'measure',
		content: {
			test_type: 'upload'
		}
	}));

	let k = 0;
	let uploadHostAndPorts = [];

	serverPorts.forEach(function(item, index) {
		uploadHostAndPorts[index] = host + ':' + item;
	});

	for (let i = 0; i < numberOfStreams; i++) {
		if (k >= uploadHostAndPorts.length)
			k = 0;
		uploadStream(i, i * 100, uploadHostAndPorts[k]);
		k++;
	}

	firstInterval = setInterval(function() {
		let tf = Date.now();
		let deltaTime = tf - previousUploadTime;
		let currentlyUploadedBytes = uploadedBytes;
		let deltaByte = currentlyUploadedBytes - previouslyUploadedBytes;
		let instSpeedInMbs = (deltaByte * 8 / 1000.0) / deltaTime;
		let percentDiff = Math.abs((instSpeedInMbs - prevInstSpeedInMbs) / instSpeedInMbs); //potrebbe anche essere negativo

		self.postMessage(JSON.stringify({
			type: 'tachometer',
			content: {
				value: instSpeedInMbs,
				message: {
					info: 'Prequalifica in corso. Attendere prego...'
				}
			}
		}));

		previousUploadTime = tf;
		previouslyUploadedBytes = currentlyUploadedBytes;
		prevInstSpeedInMbs = instSpeedInMbs;

		if (percentDiff < threshold || (tf - testStartTime >= 10000)) {
			let testWarning = false;

			if (tf - testStartTime >= 10000) {
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
			uploadedBytes = 0;
			clearInterval(firstInterval);

			secondInterval = setInterval(function() {
				let time = Date.now();
				let uploadTime = time - measureStartTime;
				let uploadedBytesAtThisTime = uploadedBytes;
				let uploadSpeedInMbs = (uploadedBytesAtThisTime * 8 / 1000) / uploadTime;

				if (testWarning) {
					self.postMessage(JSON.stringify({
						type: 'tachometer',
						content: {
							value: uploadSpeedInMbs,
							message: {
								warning: 'La tua connessione non risulta essere particolarmente stabile. Pertanto il risultato del test di upload potrebbe non essere del tutto accurato'
							}
						}
					}));
				} else {
					self.postMessage(JSON.stringify({
						type: 'tachometer',
						content: {
							value: uploadSpeedInMbs,
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
					let measureTime = time - measureStartTime;
					let totalTime = (time - testStartTime) / 1000.0;
					let uploadSpeedInKbs = uploadSpeedInMbs * 1000;
					measureResult.byte = uploadedBytesAtThisTime;
					measureResult.value = measureTime;
					measureResultsContainer.tests.push(measureResult);

					self.postMessage(JSON.stringify({
						type: 'result',
						content: {
							test_type: 'upload',
							result: uploadSpeedInKbs
						}
					}));

					if (nextFunction) {
						nextFunction();
						return;
					}
				}
			}, 500 /*TODO this.gaugeUpdateInterval*/ );
		}
	}, 3000);

	/***************upload stream*************/
	function uploadStream(index, delay, host) {
		setTimeout(function() {

			if (testDone) {
				return;
			}

			let url = 'http://' + host + '?r=' + Math.random();
			let url2 = 'http://192.168.1.180:60100' + '?r=' + Math.random();

			let prevLoadedBytes = 0;
			let xhr = new XMLHttpRequest();
			xhrArray[index] = xhr;

			xhrArray[index].upload.onprogress = function(event) {
				addBytes(event.loaded);
			};

			xhrArray[index].onerror = function(event) {
				handleDownloadAndUploadErrors(firstInterval, secondInterval, xhrArray);

				self.postMessage(JSON.stringify({
					type: 'error',
					content: 1237
				}));
			};

			xhrArray[index].upload.onload = function(event) {
				xhrArray[index].abort();
				addBytes(event.loaded);
				uploadStream(index, 0, host);
			};

			xhrArray[index].upload.onabort = function(event) {
				addBytes(event.loaded);
			};

			function addBytes(newTotalBytes) {
				let loadedBytes = newTotalBytes <= 0 ? 0 : (newTotalBytes - prevLoadedBytes);
				uploadedBytes += loadedBytes;
				prevLoadedBytes = newTotalBytes;
			}

			xhrArray[index].open('POST', url);
			//xhrArray[index].setRequestHeader('Content-Encoding', 'identity');
			xhrArray[index].send(testData);
		}, delay);
	}
	/***************end upload stream *************/
}
