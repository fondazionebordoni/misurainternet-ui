/*
	This code is derived from: speedtest_worker.js by Federico Dossena
	Licensed under the GNU LGPL license version 3,
	Original version:
		-> https://github.com/adolfintel/speedtest/blob/master/speedtest_worker.js
*/

var measureResultsContainer = {
	type: 'speedtest',
	version: '3.0.0',
	server: null,
	start: null,
	stop: null,
	tests: [],
};
var serverPorts = ["60100", "60101", "60102", "60103", "60104", "60105", "60106", "60107", "60108", "60109"];
var customTestServerIP = ['192.168.1.156']; //Put here your custom IP

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
								result: latencyAvgValue,
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
			if (timeoutEventFired) return;
			var tf = Date.now();
			clearTimeout(timeout);	// remove the timeout set when the message is sent in websocket since the reply message was received before the timeout was triggered
			if (!firstPingDone) {	// exclude the first ping
				var firstPingValue = tf - t0;
				firstPingDone = true;
				sendPingMessage();
			} else {
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
	/*
	self.postMessage(JSON.stringify(
		{
			type: 'measure',
			content: {
				'test_type': 'ping'
			}
		}
	));
	*/
	pingTest(arrayOfHostNamesAndPorts, times, maxTimeout, nextFunction);
}

/** Speedtest */
function startSpeedtest(arrayOfServers) {
	measureResultsContainer.start = (new Date()).toISOString();
	var timesToPing = 4;
	var pingMaxTimeout = 1000; //ms
	pingCodeWrapper(arrayOfServers, timesToPing, pingMaxTimeout, terminateWorker);
}

			startSpeedtest(customTestServerIP);
