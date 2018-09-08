/*
	This code is derived from: speedtest_worker.js by Federico Dossena
	Licensed under the GNU LGPL license version 3,
	Original version:
		-> https://github.com/adolfintel/speedtest/blob/master/speedtest_worker.js
*/

/* GLOBAL VARIABLES */
var measureResultsContainer = {
	type: 'speedtest',
	version: '3.0.0',
	server: null,
	start: null,
	stop: null,
	tests: [],
};

var serverPorts = ["60100", "60101", "60102", "60103", "60104", "60105", "60106", "60107", "60108", "60109"];

var useCustomTestServer = true; // Set it to true if you want to use your custom IP
var customTestServerIP = ['192.168.1.156']; //Put here your custom IP
/* END OF GLOBAL VARIABLES */

/* UTILITY FUNCTIONS */

/** Terminate the test */
function terminateWorker() {
	measureResultsContainer.stop = (new Date()).toISOString();
	self.postMessage(JSON.stringify(measureResultsContainer));
	self.close();
}

/** Close all connections */
function closeAllConnections(arrayOfXhrs) {
	for (var i = 0; i < arrayOfXhrs.length; i++) {
		try {
			arrayOfXhrs[i].onprogress = null;
			arrayOfXhrs[i].onload = null;
			arrayOfXhrs[i].onerror = null;
		}
		catch (e) { }
		try {
			arrayOfXhrs[i].upload.onprogress = null;
			arrayOfXhrs[i].upload.onload = null;
			arrayOfXhrs[i].upload.onerror = null;
		}
		catch (e) { }
		try {
			arrayOfXhrs[i].abort();
		}
		catch (e) { }
		try {
			delete (arrayOfXhrs[i]);
		}
		catch (e) { }
	}
}

/** Donwload and upload error handler */
function handleDownloadAndUploadErrors(firstInterval, secondInterval, arrayOfXhrs) {
	closeAllConnections(arrayOfXhrs);
	if (firstInterval) {
		clearInterval(firstInterval);
	}
	if (secondInterval) {
		clearInterval(secondInterval);
	}
}

/** Test data generator */
function generateTestData(numberOfMB) {
	var array = [];
	var buffer = new ArrayBuffer(1048576);
	var bufferView = new Uint32Array(buffer);
	var upperBound = Math.pow(2, 33) - 1;
	for (var i = 0; i < bufferView.length; i++) {
		bufferView[i] = Math.floor(Math.random() * upperBound);
	}
	for (var i = 0; i < numberOfMB; i++) {
		array.push(bufferView);
	}
	var testDataBlob = new Blob(array);
	return testDataBlob;
}

/** Ping code wrapper */
function pingCodeWrapper(arrayOfHostNamesAndPorts, times, maxTimeout, nextFunction) {
	var latencyAvgValue;
	var measureResult;

	/** Ping multiple servers */
	function pingTest(arrayOfHostNamesAndPorts, times, maxTimeout, nextFunction) {
		var currentMeasureResult = [];
		for (var i = 0; i < times; i++) {
			var pingObj = {
				type: 'ping',
				start: null,
				byte: 0,
				value: null
			};
			currentMeasureResult.push(pingObj);
		}
		var hostName = arrayOfHostNamesAndPorts[0];
		var hostNameAndPort = hostName + ':' + serverPorts[0];
		var firstPingDone = false;
		var count = 0;
		var totalTime = 0;
		var t0 = 0;
		var timeout;
		var timeoutEventFired = false;
		var ws = new WebSocket('ws://' + hostNameAndPort);

		/** Error, timeout, end test ping handler */
		var handleErrorsOrTimeoutsOrTestFinished = function () {
			if (ws.readyState < 3) {	// if the websocket connection has not been closed
				ws.close();
			}
			if (arrayOfHostNamesAndPorts.length === 1) {	// ping the last server of the server list passed as a parameter to the function
				if (nextFunction && measureResultsContainer.server) {
					measureResultsContainer.tests = measureResultsContainer.tests.concat(measureResult);
					self.postMessage(JSON.stringify(
						{
							type: 'result',
							content: {
								test_type: 'ping',
								result: latencyAvgValue
							}
						}
					));
					nextFunction();
				} else if (!measureResultsContainer.server) {

					self.postMessage(JSON.stringify(
						{
							type: 'error',
							content: 1235
						}
					));
				}
			} else {	// ping the others servers
				arrayOfHostNamesAndPorts.shift();	// remove the element at the top of the array
				pingTest(arrayOfHostNamesAndPorts, times, maxTimeout, nextFunction);
			}
		}

		/** send, via websocket, empty strings */
		var sendPingMessage = function () {
			t0 = Date.now();
			ws.send('');
			timeout = setTimeout(function () {
				timeoutEventFired = true;
				handleErrorsOrTimeoutsOrTestFinished();
			}, maxTimeout);
		}

		var websocketConnectionFailedTimeout = setTimeout(function () {
			if (ws.readyState === 0) {	// The websocket is still in the connecting state and the connection has not yet been established
				ws.close();  /* calling ws.close () when the connection has not yet been opened causes a closure of the websocket with event code = 1006.
								This involves calling the event handler onclose which in turn will call handleErrorsOrTimeoutsOrTestFinished */
			}
		}, 2000);

		ws.onopen = function () {
			clearTimeout(websocketConnectionFailedTimeout);
			sendPingMessage();
		}

		ws.onclose = function (event) {
			if (event.code != 1000) {	// unexpected closing of the websocket connection
				handleErrorsOrTimeoutsOrTestFinished();
			}
		}

		ws.onmessage = function () {
			if (timeoutEventFired) {
				return;
			}

			var tf = Date.now();
			clearTimeout(timeout);	// remove the timeout set when the message is sent in websocket since the reply message was received before the timeout was triggered

			if (!firstPingDone) {	// exclude the first ping
				var firstPingValue = tf - t0;
				firstPingDone = true;
				sendPingMessage();
			}

			else {
				var latency = tf - t0;
				currentMeasureResult[count].start = (new Date(t0)).toISOString();
				currentMeasureResult[count].value = latency;
				count++;
				totalTime += latency;

				if (count === times) {
					var pingAvgValue = totalTime / count;

					if (!measureResultsContainer.server) {	// first server that is being pinged
						measureResultsContainer.server = hostName;
						latencyAvgValue = pingAvgValue;
						measureResult = currentMeasureResult;
					}
					else {
						if (latencyAvgValue && pingAvgValue < latencyAvgValue) {
							measureResultsContainer.server = hostName;
							latencyAvgValue = pingAvgValue;
							measureResult = currentMeasureResult;
						}
					}
					handleErrorsOrTimeoutsOrTestFinished();
				} else {	// the test is not finished yet, server in question still to be pinged
					sendPingMessage();
				}
			}

		}
	}
	/* End ping multiple servers */

	self.postMessage(JSON.stringify(
		{
			type: 'measure',
			content: {
				'test_type': 'ping'
			}
		}
	));

	pingTest(arrayOfHostNamesAndPorts, times, maxTimeout, nextFunction);
}

/** Download test */
function downloadTest(host, bytesToDownload, numberOfStreams, timeout, threshold, nextFunction) {
	var testStartTime = Date.now();
	var previouslyDownloadedBytes = 0;
	var previousDownloadTime = testStartTime;
	var prevInstSpeedInMbs = 0;
	var downloadedBytes = 0;
	var testDone = false;
	var xhrArray = [];
	var firstInterval;
	var secondInterval;
	var measureResult = {
		type: 'download',
		start: (new Date(testStartTime)).toISOString(),
		byte: null,
		value: null
	};

	self.postMessage(JSON.stringify(
		{
			type: 'measure',
			content: {
				test_type: 'download'
			}
		}
	));

	/** Download stream function */
	var downloadStream = function (index, delay, host) {
		setTimeout(function () {

			if (testDone) {
				return;
			}

			var req = {
				request: 'download',
				data_length: bytesToDownload
			};

			var jsonReq = JSON.stringify(req);
			var url = 'http://' + host + '?r=' + Math.random() + "&data=" + encodeURIComponent(jsonReq);

			var prevLoadedBytes = 0;
			var xhr = new XMLHttpRequest();
			xhrArray[index] = xhr;

			xhrArray[index].onprogress = function (event) {
				addBytes(event.loaded);
			};

			xhrArray[index].onerror = function (event) {
				handleDownloadAndUploadErrors(firstInterval, secondInterval, xhrArray);

				self.postMessage(JSON.stringify(
					{
						type: 'error',
						content: 1236
					}
				));
			};

			xhrArray[index].onload = function (event) {
				xhrArray[index].abort();
				addBytes(event.loaded);
				downloadStream(index, 0, host);
			};

			xhrArray[index].onabort = function (event) {
				addBytes(event.loaded);
			};

			function addBytes(newTotalBytes) {
				var loadedBytes = newTotalBytes <= 0 ? 0 : (newTotalBytes - prevLoadedBytes);
				downloadedBytes += loadedBytes;
				prevLoadedBytes = newTotalBytes;
			}

			xhrArray[index].responseType = 'arraybuffer';
			xhrArray[index].open('GET', url);
			xhrArray[index].send();
		}, delay);
	}
	/***** End download stream function *******/

	var k = 0;
	var downloadHostAndPorts = [];
	serverPorts.forEach(function (item, index) {
		downloadHostAndPorts[index] = host + ':' + item;
	});
	for (var i = 0; i < numberOfStreams; i++) {
		if (k >= downloadHostAndPorts.length)
			k = 0;

		downloadStream(i, i * 100, downloadHostAndPorts[k]);

		k++;
	}

	firstInterval = setInterval(function () {
		var tf = Date.now();
		var deltaTime = tf - previousDownloadTime;
		var currentlyDownloadedBytes = downloadedBytes;
		var deltaByte = currentlyDownloadedBytes - previouslyDownloadedBytes;
		var instSpeedInMbs = (deltaByte * 8 / 1000.0) / deltaTime;
		var percentDiff = Math.abs((instSpeedInMbs - prevInstSpeedInMbs) / instSpeedInMbs); //potrebbe anche essere negativo

		self.postMessage(JSON.stringify(
			{
				type: 'tachometer',
				content: {
					value: instSpeedInMbs,
					message: {
						info: 'Prequalifica in corso. Attendere prego ...'
					}
				}
			}
		));

		previousDownloadTime = tf;
		previouslyDownloadedBytes = currentlyDownloadedBytes;
		prevInstSpeedInMbs = instSpeedInMbs;

		if (percentDiff < threshold || (tf - testStartTime > 10000)) {
			var testWarning = false;
			if (tf - testStartTime > 10000) {
				if (instSpeedInMbs === 0) {
					handleDownloadAndUploadErrors(firstInterval, secondInterval, xhrArray);

					self.postMessage(JSON.stringify(
						{
							type: 'error',
							content: 1238
						}
					));
					return;
				}
				testWarning = true;
			}
			var measureStartTime = Date.now();
			downloadedBytes = 0;
			clearInterval(firstInterval);

			secondInterval = setInterval(function () {
				var time = Date.now();
				var downloadTime = time - measureStartTime;
				var downloadedBytesAtThisTime = downloadedBytes;
				var downloadSpeedInMbs = (downloadedBytesAtThisTime * 8 / 1000) / downloadTime;
				if (testWarning) {
					self.postMessage(JSON.stringify(
						{
							type: 'tachometer',
							content: {
								value: downloadSpeedInMbs,
								message: {
									warning: 'La tua connessione non risulta essere particolarmente stabile. Pertanto il risultato del test di download potrebbe non essere del tutto accurato'
								}
							}
						}
					));
				}
				else {
					self.postMessage(JSON.stringify(
						{
							type: 'tachometer',
							content: {
								value: downloadSpeedInMbs,
								message: {
									info: 'Misurazione in corso...'
								}
							}
						}
					));
				}

				if ((time - measureStartTime) >= timeout) {
					closeAllConnections(xhrArray);
					clearInterval(secondInterval);
					testDone = true;
					var totalTime = (time - testStartTime) / 1000.0;
					var measureTime = time - measureStartTime;
					var downloadSpeedInKbs = downloadSpeedInMbs * 1000;
					measureResult.byte = downloadedBytesAtThisTime;
					measureResult.value = measureTime;
					measureResultsContainer.tests.push(measureResult);
					self.postMessage(JSON.stringify(
						{
							type: 'result',
							content: {
								test_type: 'download',
								result: downloadSpeedInKbs
							}
						}
					));

					//esegui, se presente, la successiva funzione
					if (nextFunction) {
						nextFunction();
					}
				}
			}, 200)
		}
	}, 3000)

}

/** Upload test */
function uploadTest(host, bytesToUpload, numberOfStreams, timeout, threshold, nextFunction) {
	var testStartTime = Date.now();
	var previouslyUploadedBytes = 0;
	var previousUploadTime = testStartTime;
	var prevInstSpeedInMbs = 0;
	var testData = generateTestData(bytesToUpload / (Math.pow(1024, 2)));
	var uploadedBytes = 0;
	var testDone = false;
	var xhrArray = [];
	var firstInterval;
	var secondInterval;
	var measureResult = {
		type: 'upload',
		start: (new Date(testStartTime)).toISOString(),
		byte: null,
		value: null
	};

	self.postMessage(JSON.stringify(
		{
			type: 'measure',
			content: {
				test_type: 'upload'
			}
		}
	));

	/** Upload stream */
	function uploadStream(index, delay, host) {
		setTimeout(function () {

			if (testDone) {
				return;
			}

			var url = 'http://' + host + '?r=' + Math.random();

			var prevLoadedBytes = 0;
			var xhr = new XMLHttpRequest();
			xhrArray[index] = xhr;

			xhrArray[index].upload.onprogress = function (event) {
				addBytes(event.loaded);
			};

			xhrArray[index].onerror = function (event) {
				handleDownloadAndUploadErrors(firstInterval, secondInterval, xhrArray);

				self.postMessage(JSON.stringify(
					{
						type: 'error',
						content: 1237
					}
				));
			};

			xhrArray[index].upload.onload = function (event) {
				xhrArray[index].abort();
				addBytes(event.loaded);
				uploadStream(index, 0, host);
			};

			xhrArray[index].upload.onabort = function (event) {
				addBytes(event.loaded);
			};

			function addBytes(newTotalBytes) {
				var loadedBytes = newTotalBytes <= 0 ? 0 : (newTotalBytes - prevLoadedBytes);
				uploadedBytes += loadedBytes;
				prevLoadedBytes = newTotalBytes;
			}

			xhrArray[index].open('POST', url);
			xhrArray[index].send(testData);
		}, delay);
	}

	var k = 0;
	var uploadHostAndPorts = [];
	serverPorts.forEach(function (item, index) {
		uploadHostAndPorts[index] = host + ':' + item;
	});
	for (var i = 0; i < numberOfStreams; i++) {
		if (k >= uploadHostAndPorts.length) k = 0;
		uploadStream(i, i * 100, uploadHostAndPorts[k]);
		k++;
	}

	firstInterval = setInterval(function () {
		var tf = Date.now();
		var deltaTime = tf - previousUploadTime;
		var currentlyUploadedBytes = uploadedBytes;
		var deltaByte = currentlyUploadedBytes - previouslyUploadedBytes;
		var instSpeedInMbs = (deltaByte * 8 / 1000.0) / deltaTime;
		var percentDiff = Math.abs((instSpeedInMbs - prevInstSpeedInMbs) / instSpeedInMbs);	// it could also be negative

		self.postMessage(JSON.stringify(
			{
				type: 'tachometer',
				content: {
					value: instSpeedInMbs,
					message: {
						info: 'Prequalifica in corso. Attendere prego...'
					}
				}
			}
		));

		previousUploadTime = tf;
		previouslyUploadedBytes = currentlyUploadedBytes;
		prevInstSpeedInMbs = instSpeedInMbs;

		if (percentDiff < threshold || (tf - testStartTime >= 10000)) {
			var testWarning = false;

			if (tf - testStartTime >= 10000) {
				if (instSpeedInMbs === 0) {
					handleDownloadAndUploadErrors(firstInterval, secondInterval, xhrArray);

					self.postMessage(JSON.stringify(
						{
							type: 'error',
							content: 1238
						}
					));
					return;
				}
				testWarning = true;
			}
			var measureStartTime = Date.now();
			uploadedBytes = 0;
			clearInterval(firstInterval);

			secondInterval = setInterval(function () {
				var time = Date.now();
				var uploadTime = time - measureStartTime;
				var uploadedBytesAtThisTime = uploadedBytes;
				var uploadSpeedInMbs = (uploadedBytesAtThisTime * 8 / 1000) / uploadTime;

				if (testWarning) {
					self.postMessage(JSON.stringify(
						{
							type: 'tachometer',
							content: {
								value: uploadSpeedInMbs,
								message: {
									warning: 'La tua connessione non risulta essere particolarmente stabile. Pertanto il risultato del test di upload potrebbe non essere del tutto accurato'
								}
							}
						}
					));
				} else {
					self.postMessage(JSON.stringify(
						{
							type: 'tachometer',
							content: {
								value: uploadSpeedInMbs,
								message: {
									info: 'Misurazione in corso...'
								}
							}
						}
					));
				}
				if ((time - measureStartTime) >= timeout) {
					closeAllConnections(xhrArray);
					clearInterval(secondInterval);
					testDone = true;
					var measureTime = time - measureStartTime;
					var totalTime = (time - testStartTime) / 1000.0;
					var uploadSpeedInKbs = uploadSpeedInMbs * 1000;
					measureResult.byte = uploadedBytesAtThisTime;
					measureResult.value = measureTime;
					measureResultsContainer.tests.push(measureResult);

					self.postMessage(JSON.stringify(
						{
							type: 'result',
							content: {
								test_type: 'upload',
								result: uploadSpeedInKbs
							}
						}
					));
					if (nextFunction) {
						nextFunction();
					}
				}
			}, 200)
		}
	}, 3000)

}
/* END OF UTILITY FUNCTIONS */

/** Speedtest */
function startSpeedtest(arrayOfServers) {
	var m50 = 52428800;
	var m1 = 1048576;
	var m5 = 5242880;
	var m10 = 5242880 * 2;
	var m25 = m50 / 2;
	var m20 = m5 * 4;
	var m30 = m10 * 3;
	var m80 = m10 * 8;
	var m100 = m50 * 2;

	measureResultsContainer.start = (new Date()).toISOString();
	var timesToPing = 4;
	var pingMaxTimeout = 1000; //ms
	var bytesToDownload = m50;  //50MB
	var bytesToUpload = m50;    //50MB
	var numberOfDownloadStreams = 20;
	var numberOfUploadStreams = 20;
	var downloadTestTimeout = 10000; //ms
	var uploadTestTimeout = 10000; //ms
	var downloadTestThreshold = 0.10;
	var uploadTestThreshold = 0.10;

	pingCodeWrapper(arrayOfServers, timesToPing, pingMaxTimeout, terminateWorker);
}

/** Worker listener */
function workerListener() {
	self.onmessage = function (message) {
		if (useCustomTestServer) {
			startSpeedtest(customTestServerIP);
		} else {
			var req = JSON.parse(message.data);
			if (req.request && req.request === 'startMeasure' && req.servers && req.servers.length > 0) {
				startSpeedtest(req.servers);
			}
		}
	}
}
workerListener();