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
var serverPort = "60100";
var customTestServerIP = ['192.168.1.2']; //Put here your custom IP
var pingNuovaProva = 0.0;

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
function pingCodeWrapper(host, times, maxTimeout, nextFunction) {
	var latencyAvgValue;
	var measureResult;

	/** Ping multiple servers */
	function pingTest(host, times, maxTimeout, nextFunction) {
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
		var hostNameAndPort = host + ':' + serverPort;
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

		/* Petrucci functions */
		var createContainer = function (contenitor) {
			var container = [];
			for (var i in contenitor) container.push(contenitor[i].value);
			return container;
		}

		var createPingResults = function (contenitor, divisor) {
			var contenitoreTemp = 0;
			var nuovoContenitore = [];
			var lunghezzaContenitore = contenitor.length;
			var parti = lunghezzaContenitore / divisor;
			var j = 0, k;

			while (j < lunghezzaContenitore) {
				for (var i = 0; i < parti; i++) {
					for (k = 0; k < divisor; k++) {
						contenitoreTemp += contenitor[j];
						j++;
					}
					nuovoContenitore[i] = contenitoreTemp / k;
					contenitoreTemp = 0;
				}
			}
			return nuovoContenitore;
		}

		var pingMin = function (contenitore) {
			var minMeasure = contenitore[0];
			for (var i = 1; i < contenitore.length; i++) {
				var measure = contenitore[i];
				if (measure < minMeasure) minMeasure = measure;
			}
			return minMeasure.toFixed(2);
		}

		var pingMax = function (contenitore) {
			var maxMeasure = contenitore[0];
			for (var i = 1; i < contenitore.length; i++) {
				var measure = contenitore[i];
				if (measure > maxMeasure) maxMeasure = measure;
			}
			return maxMeasure.toFixed(2);
		}

		var pingJit = function (contenitore) {
			var prevLatency = 0;
			var latency = 0.0;
			var jitter = 0.0;
			var a = 0;
			var contenitoreJit = 0;
			for (var i = 1; i < contenitore.length; i++) {
				prevLatency = contenitore[i - 1]
				latency = contenitore[i];
				var instjitter = Math.abs(latency - prevLatency)
				contenitoreJit += instjitter;
				a++;
				jitter = instjitter > jitter ? (jitter * 0.2 + instjitter * 0.8) : (jitter * 0.9 + instjitter * 0.1) // update jitter, weighted average. spikes in ping values are given more weight.
			}
			console.log("jitMedia: " + (contenitoreJit / a).toFixed(2));
			return jitter.toFixed(2);
		}
		/* End Petrucci Functions */


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
				firstPingDone = true;
				sendPingMessage();
			} else {
				var latency = tf - t0;
				if (count == 0) pingNuovaProva = latency;
				pingNuovaProva = pingNuovaProva * 0.9 + latency * 0.1;
				currentMeasureResult[count].start = (new Date(t0)).toISOString();
				currentMeasureResult[count].value = latency;
				count++;
				totalTime += latency;

				if (count === times) {
					var pingAvgValue = totalTime / count;
					// Petrucci contents
					var container, newContainer;
					var divisor = 5;
					container = createContainer(currentMeasureResult);
					newContainer = createPingResults(container, divisor);
					console.log("avg: " + pingAvgValue.toFixed(2));
					console.log("min: " + pingMin(newContainer));
					console.log("max: " + pingMax(newContainer));
					console.log("jit: " + pingJit(newContainer));
					console.log("pingNuovaProva: " + pingNuovaProva.toFixed(2));
					// End Petrucci contents
					measureResultsContainer.server = host;
					latencyAvgValue = pingAvgValue;
					measureResult = currentMeasureResult;
					handleErrorsOrTimeoutsOrTestFinished();
				} else sendPingMessage();	// the test is not finished yet, server in question still to be pinged
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

	pingTest(host, times, maxTimeout, nextFunction);
}

/** Speedtest */
function startSpeedtest(server) {
	measureResultsContainer.start = (new Date()).toISOString();
	var timesToPing = 50;
	var pingMaxTimeout = 1000000; //ms
	pingCodeWrapper(server, timesToPing, pingMaxTimeout, terminateWorker);
}

startSpeedtest(customTestServerIP);