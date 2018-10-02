//TODO include credits from jsscan project (sourceforge)

const evilscan = require('evilscan');

//TODO Richiedere al client i parametri del port scan tramite JSON (implementare un readMsg?) ed avviare il test quando richiesto

let options = {
    target:'127.0.0.1',
    port:'21-23',
    status:'TROU', // Timeout, Refused, Open, Unreachable
    banner:true
};

let scanner = new evilscan(options);

scanner.on('result',function(data) {
    // fired when item is matching options
    console.log(data);
});

scanner.on('error',function(err) {
    throw new Error(data.toString());
});

scanner.on('done',function() {
	console.log('finished');
    // finished !
});

scanner.run();