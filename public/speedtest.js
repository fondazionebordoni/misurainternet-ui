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
var begin;
var serverPort = "60100";
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
function pingCodeWrapper(host, times, maxTimeout, nextFunction) {
	var latencyAvgValue;
	var measureResult;
	var pingPerf;
	var jitter = 0.0;	// Current jitter value
	var prevLatency = 0;	// last latency time, used for jitter calculation

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
		var sumTime = 0;
		var 
		t0 = 0;
		var t00;
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
			t00 = performance.now();
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
			begin = performance.now()
			console.log("INIZIO TEST: "+ begin.toFixed(2) + " ms")
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
			var tff = performance.now();
			clearTimeout(timeout);	// remove the timeout set when the message is sent in websocket since the reply message was received before the timeout was triggered
			if (!firstPingDone) {	// exclude the first ping
				firstPingDone = true;
				sendPingMessage();
			} else {
				var latency = tf - t0;
				var latencyPerf = tff - t00;
				var instJitter = Math.abs(latencyPerf - prevLatency);
				if (count == 0) pingPerf = latencyPerf;
				else {
					pingPerf = latencyPerf < pingPerf ? pingPerf * 0.2 + latencyPerf * 0.8 : pingPerf * 0.8 + latencyPerf * 0.2;
					if (count == 1) jitter = instJitter;
					else jitter = instJitter > jitter ? jitter * 0.3 + instJitter * 0.7 : jitter * 0.8 + instJitter * 0.2;
				}
				prevLatency = latencyPerf;
				currentMeasureResult[count].start = (new Date(t0)).toISOString();
				currentMeasureResult[count].value = latency;
				count++;
				sumTime += latency;

				if (count == times) {
					var end = performance.now();
					var tempoTotale = end - begin;
					var pingAvgValue = sumTime / count;
					console.log("Latenza media: " + pingAvgValue.toFixed(2));
					console.log("Latenza media Perf: " + pingPerf.toFixed(2));
					console.log("jitter: " + jitter.toFixed(2));
					console.log("FINE TEST: "+ end.toFixed(2) + " ms");
					console.log("TEMPO TEST: "+ tempoTotale.toFixed(2) + " ms");
					console.log('');
					measureResultsContainer.server = host;
					latencyAvgValue = pingAvgValue;
					measureResult = currentMeasureResult;
					handleErrorsOrTimeoutsOrTestFinished();
				} else sendPingMessage();	// the test is not finished yet, server in question still to be pinged
			}
		}
	}

	self.postMessage(JSON.stringify(
		{
			type: 'measure',
			content: {
				'test_type': 'ping'
			}
		}
	));

	pingTest(host, times, maxTimeout, nextFunction); //start first ping
}

/** Speedtest */
function startSpeedtest(server) {
	measureResultsContainer.start = (new Date()).toISOString();
	var timesToPing = 100;
	var pingMaxTimeout = 1000; //ms
	pingCodeWrapper(server, timesToPing, pingMaxTimeout, terminateWorker);
}

startSpeedtest(customTestServerIP);