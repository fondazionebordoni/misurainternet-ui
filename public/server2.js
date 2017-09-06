var WebSocketServer = require('ws').Server;

var arrayOfMessages=([

  {type:'profilation', content: {done: 'False'}},
  {type: 'sys_resource', content: {info: '', state: 'error', resource: 'ethstatus'}},
  {type: 'sys_resource', content: {info: '', state: 'error', resource: 'cpustatus'}},
  {type: 'sys_resource', content: {info: '', state: 'error', resource: 'ramstatus'}},
  {type: 'sys_resource', content: {info: '', state: 'error', resource: 'wifistatus'}},

  {type:'profilation', content: {done: 'False'}},

  {type: 'sys_resource', content: {info: '', state: 'ok', resource: 'ethstatus'}},
  {type: 'sys_resource', content: {info: '', state: 'ok', resource: 'cpustatus'}},
  {type: 'sys_resource', content: {info: '', state: 'ok', resource: 'ramstatus'}},
  {type: 'sys_resource', content: {info: '', state: 'ok', resource: 'wifistatus'}},

  {type: 'sys_resource', content: {info: 'Presenza di altri host in rete', state: 'error', resource: 'hoststatus'}},
  {type: 'notification', content: {message: 'Presenza di altri host in rete', error_code: 5081, datatime: '2017-07-10 17:02:54'}},
  {type:'profilation', content: {done: 'True'}},
  {type: 'wait', content: {seconds: 30, message: 'Aspetto 30 secondi prima di continuare'}},

  {type: 'notification', content: {message: 'Impossibile dialogare con lo scheduler delle misure', error_code: 1001, datetime: '2017-07-11 19:53:46'}},
  {type: 'wait', content: {seconds: 30, message: 'Aspetto 30 secondi prima di continuare'}},
  {type: 'notification', content: {message: 'Impossibile dialogare con lo scheduler delle misure', error_code: 1001, datetime: '2017-07-11 19:54:46'}},
  {type: 'wait', content: {seconds: 30, message: 'Aspetto 30 secondi prima di continuare'}},

  {type: 'notification', content: {message: 'Impossibile dialogare con lo scheduler delle misure', error_code: 1001, datetime: '2017-07-11 23:49:48'}},
  {type:'profilation', content: {done: 'False'}},
  {type: 'sys_resource', content: {info: 'La velocità della scheda di rete è 0 Mb/s, che è minore della velocità del profilo: 7 Mb/s', state: 'ok', resource: 'ethstatus'}},

  {type: 'notification', content: {message: 'Impossibile dialogare con lo scheduler delle misure', error_code: 1001, datetime: '2017-07-11 19:53:46'}},
  {type: 'wait', content: {seconds: 30, message: 'Aspetto 30 secondi prima di continuare'}},
  {type: 'wait', content: {seconds: 779, message: 'Licenza di misura scaduta o non valida per le misure'}},
  {type: 'wait', content: {seconds: 30, message: 'Aspetto 30 secondi prima di continuare'}},

  {type:'profilation', content: {done: 'False'}},

  {type: 'sys_resource', content: {info: '', state: 'ok', resource: 'ethstatus'}},
  {type: 'sys_resource', content: {info: '', state: 'ok', resource: 'cpustatus'}},
  {type: 'sys_resource', content: {info: '', state: 'ok', resource: 'ramstatus'}},
  {type: 'sys_resource', content: {info: '', state: 'ok', resource: 'wifistatus'}},

  {type:'profilation', content: {done: 'True'}},

  /*{type: 'resume', content: {test_type: 'ping'}},
  {type: 'measure', content: {test_type: 'ping'}},
  {type: 'test', content: {test_type: 'ping', n_tot: 4, retry: 'False', n_test: 1}},
  {type: 'tachometer', content: {value: 2.464567897654}},
  {type: 'test', content: {test_type: 'ping', n_tot: 4, retry: 'False', n_test: 2}},
  {type: 'tachometer', content: {value: 2.34567890}},
  {type: 'test', content: {test_type: 'ping', n_tot: 4, retry: 'False', n_test: 3}},
  {type: 'tachometer', content: {value: 2.6767677676767}},
  {type: 'test', content: {test_type: 'ping', n_tot: 4, retry: 'False', n_test: 4}},
  {type: 'tachometer', content: {value: 2.234567890}},
  {type: 'result', content: {test_type: 'ping', result: 2.234567890}},


  {type: 'measure', content: {test_type: 'download', bw:0}},
  {type: 'test', content: {test_type: 'download', n_tot: 1, retry: 'False', n_test: 1}},
  {type: 'tachometer', content: {value: 90.234567890}},
  {type: 'tachometer', content: {value: 72.98767898789}},
  {type: 'tachometer', content: {value: 82.34567890}},
  {type: 'tachometer', content: {value: 90.234567890}},
  {type: 'tachometer', content: {value: 72.98767898789}},
  {type: 'tachometer', content: {value: 82.34567890}},
  {type: 'tachometer', content: {value: 90.234567890}},
  {type: 'tachometer', content: {value: 72.98767898789}},
  {type: 'tachometer', content: {value: 82.34567890}},
  {type: 'tachometer', content: {value: 90.234567890}},
  {type: 'tachometer', content: {value: 72.98767898789}},
  {type: 'tachometer', content: {value: 82.34567890}},


  {type: 'measure', content: {test_type: 'upload', bw:0}},
  {type: 'test', content: {test_type: 'upload', n_tot: 1, retry: 'False', n_test: 1}},
  {type: 'tachometer', content: {value: 34.234567890}},
  {type: 'tachometer', content: {value: 36.98767898789}},
  {type: 'tachometer', content: {value: 23.34567890}},
  {type: 'tachometer', content: {value: 34.234567890}},
  {type: 'tachometer', content: {value: 35.98767898789}},
  {type: 'tachometer', content: {value: 37.34567890}},
  {type: 'tachometer', content: {value: 20.234567890}},
  {type: 'tachometer', content: {value: 36.98767898789}},
  {type: 'tachometer', content: {value: 30.34567890}},
  {type: 'tachometer', content: {value: 32.234567890}},
  {type: 'tachometer', content: {value: 22.98767898789}},
  {type: 'tachometer', content: {value: 32.34567890}},
  {type: 'result', content: {spurious: 0.044567845678,test_type: 'upload', result: 35785}},
  {type: 'wait', content: {seconds: 30,message: 'Aspetto 30 secondi prima di continuare'}}, */

//secodo test

  {type: 'resume', content: {test_type: 'ping'}},
  {type: 'measure', content: {test_type: 'ping'}},
  {type: 'test', content: {test_type: 'ping', n_tot: 4, retry: 'False', n_test: 1}},
  {type: 'tachometer', content: {value: 2.464567897654}},
  {type: 'test', content: {test_type: 'ping', n_tot: 4, retry: 'False', n_test: 2}},
  {type: 'tachometer', content: {value: 2.34567890}},
  {type: 'test', content: {test_type: 'ping', n_tot: 4, retry: 'False', n_test: 3}},
  {type: 'tachometer', content: {value: 2.6767677676767}},
  {type: 'test', content: {test_type: 'ping', n_tot: 4, retry: 'False', n_test: 4}},
  {type: 'tachometer', content: {value: 2.234567890}},
  {type: 'result', content: {test_type: 'ping', result: 2.234567890}},

   {type: 'measure', content: {test_type: 'download', bw:50}},
  {type: 'test', content: {test_type: 'download', n_tot: 1, retry: 'False', n_test: 1}},
  {type: 'tachometer', content: {value: 90.234567890}},
  {type: 'tachometer', content: {value: 72.98767898789}},
  {type: 'tachometer', content: {value: 82.34567890}},
  {type: 'tachometer', content: {value: 90.234567890}},
  {type: 'tachometer', content: {value: 72.98767898789}},
  {type: 'tachometer', content: {value: 82.34567890}},
  {type: 'tachometer', content: {value: 90.234567890}},
  {type: 'tachometer', content: {value: 72.98767898789}},
  {type: 'tachometer', content: {value: 82.34567890}},
  {type: 'tachometer', content: {value: 90.234567890}},
  {type: 'tachometer', content: {value: 72.98767898789}},
  {type: 'tachometer', content: {value: 82.34567890}},

  {type: 'result', content: {spurious: 0.0513456789,test_type: 'download', result: 89936 }},

  {type: 'measure', content: {test_type: 'upload', bw:10}},
  {type: 'test', content: {test_type: 'upload', n_tot: 1, retry: 'False', n_test: 1}},
  {type: 'tachometer', content: {value: 3.234567890}},
  {type: 'tachometer', content: {value: 3.98767898789}},
  {type: 'tachometer', content: {value: 2.34567890}},
  {type: 'tachometer', content: {value: 3.234567890}},
  {type: 'tachometer', content: {value: 3.98767898789}},
  {type: 'tachometer', content: {value: 3.34567890}},
  {type: 'tachometer', content: {value: 2.234567890}},
  {type: 'tachometer', content: {value: 3.98767898789}},
  {type: 'tachometer', content: {value: 3.34567890}},
  {type: 'tachometer', content: {value: 3.234567890}},
  {type: 'tachometer', content: {value: 2.98767898789}},
  {type: 'tachometer', content: {value: 2.34567890}},
  {type: 'result', content: {test_type: 'upload', error: 'Eccessiva presenza di traffico internet non legato alla misura: percentuali 43%.'}},

  {type: 'test', content: {test_type: 'upload', n_tot: 1, retry: 'True', n_test: 1}},
  {type: 'tachometer', content: {value: 3.234567890}},
  {type: 'tachometer', content: {value: 3.98767898789}},
  {type: 'tachometer', content: {value: 2.34567890}},
  {type: 'tachometer', content: {value: 3.234567890}},
  {type: 'tachometer', content: {value: 3.98767898789}},
  {type: 'tachometer', content: {value: 3.34567890}},
  {type: 'tachometer', content: {value: 2.234567890}},
  {type: 'tachometer', content: {value: 3.98767898789}},
  {type: 'tachometer', content: {value: 3.34567890}},
  {type: 'tachometer', content: {value: 3.234567890}},
  {type: 'tachometer', content: {value: 2.98767898789}},
  {type: 'tachometer', content: {value: 3.34567890}},
  {type: 'notification', content: {message: 'Eccessiva presenza di traffico internet non legato alla misura: percentuali 26%.', error_code: 99999, datetime: '2017-08-23 21:04:37'}},

  {type: 'measure', content: {test_type: 'upload', bw:0}},
  {type: 'test', content: {test_type: 'upload', n_tot: 1, retry: 'False', n_test: 1}},
  {type: 'tachometer', content: {value: 34.234567890}},
  {type: 'tachometer', content: {value: 36.98767898789}},
  {type: 'tachometer', content: {value: 23.34567890}},
  {type: 'tachometer', content: {value: 34.234567890}},
  {type: 'tachometer', content: {value: 35.98767898789}},
  {type: 'tachometer', content: {value: 37.34567890}},
  {type: 'tachometer', content: {value: 20.234567890}},
  {type: 'tachometer', content: {value: 36.98767898789}},
  {type: 'tachometer', content: {value: 30.34567890}},
  {type: 'tachometer', content: {value: 32.234567890}},
  {type: 'tachometer', content: {value: 22.98767898789}},
  {type: 'tachometer', content: {value: 32.34567890}},

  {type: 'result', content: {spurious: 0.044567845678,test_type: 'upload', result: 35785}},

  {type: 'wait', content: {seconds: 30,message: 'Aspetto 30 secondi prima di continuare'}},

  {type: 'notification', content: {message: 'Impossibile dialogare con lo scheduler delle misure', error_code: 1001, datetime: '2017-07-11 19:53:46'}},
  {type: 'notification', content: {message: 'Impossibile dialogare con lo scheduler delle misure', error_code: 1001, datetime: '2017-07-11 19:53:46'}},
  {type: 'notification', content: {message: 'Impossibile dialogare con lo scheduler delle misure', error_code: 1001, datetime: '2017-07-11 19:53:46'}},


]);


wss = new WebSocketServer({port: 8080});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
      console.log('messaggio ricevuto');
      for(let i=0; i<arrayOfMessages.length; i++){
        setTimeout(function(){
          ws.send(JSON.stringify(arrayOfMessages[i]));
        }, 500*(i+1))
      }
    });
});
