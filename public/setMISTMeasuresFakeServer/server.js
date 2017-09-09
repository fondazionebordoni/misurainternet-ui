/*TODO: Eliminare poi questo file*/

var http = require('http');

var server = http.createServer(function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*'); //modificare poi '*' con il sito di misurainternet

	if(req.method==='POST'){
		console.log('Received message POST');
		res.writeHead(200);
		res.end();
	}

	else if(req.method==='OPTIONS'){
		console.log('messaggio ricevuto OPTIONS')
		res.setHeader('Access-Control-Allow-Methods', 'POST');
		res.setHeader('Access-Control-Allow-Headers',['content-type','cache-control']);
		res.setHeader('Access-Control-Max-Age',600); // il client puo inviarmi altre richieste POST per 5 minuti prima di dover nuovamente mandarmi nuovamente una richiesta OPTIONS
		res.writeHead(200);
		res.end();
	}

	else{
		console.log('Metodo ' +  req.method + ' non previsto');
		res.writeHead(404);
		res.end();
	}

})
server.listen(1234);
