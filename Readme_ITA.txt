MisuraInternet Speedtest è un tool per verificare le prestazioni della rete, in modo analogo ad altri speedtest disponibili in rete.
MisuraInternet Speedtest è una applicazione web accessibile via browser. Offre un'interfaccia in cui è possibile interagire con
i servizi e i software di misurainternet.it. 
In particolare è possibile visualizzare lo stato di Nemesys quando è in esecuzione sulla propria macchina.
Per maggiori informazioni sul software Nemesys, andare sul sito misurainternet.it.
La funzionalità principale dell'applicazione è quella di testare la connessione ad internet, ottenendo dei valori di ping, download e upload
che offrono informazioni sulle prestazioni della rete. 

Informazioni tecniche:
L'applicazione viene eseguita in un web server che la rende disponibile in rete.
Un browser può accedervi ed eseguire il test. Lo script che effettua il test è eseguito dal motore JavaScript 
del browser e le rilevazioni di ping, download, upload sono relative alla connessione della macchina client su cui è aperto il browser.
Per ottenere le misurazioni lo script si connette ad un server esterno di misurainternet.it.

MisuraInternet Speedtest è implementato in JavaScript ed utilizza Node.js per essere eseguito lato server.
Dal sito ufficiale di Node.js:
	Node.js® è un runtime Javascript costruito sul motore JavaScript V8 di Chrome.
	Node.js usa un modello I/O non bloccante e ad eventi, che lo rende un framework leggero ed efficiente. 
	L'ecosistema dei pacchetti di Node.js, npm, è il più grande ecosistema di librerie open source al mondo.

Per maggiori informazioni su Node.js e npm, andare sui rispettivi siti ufficiali.
L'interfaccia è realizzata in React, una libreria JavaScript creata da Facebook per realizzare 
interfacce responsive e scalabili.

L'utilizzo di MisuraInternet Speedtest sulla propria macchina è inteso a fini di sviluppo e di testing. 
L'applicazione rilasciata in versione definitiva è in esecuzione ed è disponibile sul sito misurainternet.it. 

Se si è intenzionati ad eseguire MisuraInternet Speedtest sulla propria macchina, di seguito sono riportate tutte le informazioni necessarie.

Requisiti:
- Installare Git. Sarà necessario per scaricare il codice del progetto.
- Installare Node.js. Durante l'installazione dovrebbe essere installato anche npm, 
  necessario per l'esecuzione dell'applicazione. Assicurarsi che sia installato correttamente.
- Per caricare l'applicazione, il web browser ha bisogno di avere Cross-Origin Resource Sharing (CORS) abilitato.
  Può essere abilitato nelle impostazioni per sviluppatori in alcuni browser, altrimenti tramite una estensione.
  Questa limitazione si verifica quando il web server viene eseguito al di fuori del dominio di misurainternet.it.

Come funziona:
Un web server, creato e gestito da Node.js, viene eserguito sulla tua macchina. L'applicazione è disponibile attraverso un browser, connettendosi al web server.
L'applicazione viene eseguita sul motore JavaScript del browser. L'applicazione esegue i test di ping, download e upload utilizzando un server di misurainternet.it esterno.

Istruzioni passo passo per creare l'ambiente di sviluppo sulla tua macchina:

- Usare Git per clonare il progetto da GitHub. Usando Git da linea di comando, lanciare "git clone https://github.com/fondazionebordoni/misurainternet-ui.git"
- Dal terminale, navigare nella cartella di root del progetto appena clonato "misurainternet-ui"
- Adesso si devono installare le dipendendenze del progetto. Queste sono descritte nel file "package.json".
  Per farlo, bisogna usare npm affinchè scarichi le librerie nella cartella del progetto.
  Inserire nel terminale il comando "npm install" e l'operazione verrà eseguita in automatico. Potrebbe richiedere qualche minuto.
- Inserire il comando "npm install ws" e aspettare che scarichi tutti i pacchetti

Adesso sarà possibile eseguire il web server, effettuando i seguenti passaggi:
- Aprire una nuova finestra del terminale e navigare nella cartella di root del progetto.
- Usare il comando "npm start". Questo avvierà il web server e l'applicazione React. Dopo pochi istanti si aprirà il browser di default con la pagina dell'applicazione.

nota: Il web server renderà disponibile l'applicaizone sulla porta 3000. Per accedervi dalla macchina stessa, digitare "localhost:3000"
      nella barra degli indirizzi di un qualsiasi browser.


//Dopo che ho aggiunto le connessioni multiporta, le istruzioni qui sotto non funzionano più, devo sistemare meglio il codice

Istruzioni per configurare l'applicazione in modo che utilizzi un server di test personalizzato:
Se si vuole usare un proprio server di test (il progetto misurainternet-speedtest ne contiene uno, vedere il readme del progetto
per maggiori informazioni sul suo utilizzo), in alternativa ai server di misurainternet.it, bisogna fare in modo che l'applicazione web punti a questo server.
Per fare questa configurazione sarà necessario andare a modificare una riga di codice dell'applicativo.
La modifica si può fare in 2 modi diversi, in base a 2 casi:
- Il client avrà accesso ad internet durante l'utilizzo dell'applicativo e durante il test:
	- Aprire il file public\speedtest.js e cercare nel file la riga "startSpeedtest(req.servers);"
	- Sostituire "req.servers" con un array di stringhe che contanga una sola stringa, rappresentante l'indirizzo del server di test 
	  Se per esempio il server di test ha indirizzo 192.168.1.5 e ascolta sulla porta 60100, l'array sarà definito così: ["192.168.1.5:60100"]
	  Alla fine della modifica, si avrà la riga modificata in questo modo: startSpeedtest(["192.168.1.5:60100"]);
- Il client non avrà accesso ad internet durante l'utilizzo dell'applicativo e il durante test (un test offline, in una rete in cui siano presenti client, web server e server di test):
	- Aprire il file App.js e trovare la riga "mistTestServers: null,"
	- Sosituire "null" con un array di stringhe che contenga una sola stringa, rappresentante l'indirizzo del server di test
	  Se per esempio il server di test ha indirizzo 192.168.1.5 e ascolta sulla porta 60100, l'array sarà definito così: ["192.168.1.5:60100"]
	  Alla fine della modifica, si avrà la riga modificata in questo modo: mistTestServers: ["192.168.1.5:60100"],
