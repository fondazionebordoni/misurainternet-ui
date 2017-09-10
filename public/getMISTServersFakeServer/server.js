/*TODO: Eliminare poi questo file*/
var http = require('http');

var server = http.createServer(function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*'); //modificare poi '*' con il sito di misurainternet

	if(req.method==='GET'){
		console.log('Received message GET');
		var responseData=
    {
      servers : [
        {
          ip : "34.210.59.77:8080",
          srvname : "testServer1"
        },
        {
          ip : "34.210.59.77:8080",
          srvname : "testServer2"
        }
      ]
    };

		res.writeHead(200);
		res.end(JSON.stringify(responseData));
	}

	else if(req.method==='OPTIONS'){
		console.log('messaggio ricevuto OPTIONS')
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Headers','cache-control');
		res.setHeader('Access-Control-Max-Age',600); // il client puo inviarmi altre richieste per 5 minuti prima di dover nuovamente mandarmi nuovamente una richiesta OPTIONS
		res.writeHead(200);
		res.end();
	}

	else{
		console.log('Metodo ' +  req.method + ' non previsto');
		res.writeHead(404);
	}


})
server.listen(1236);
