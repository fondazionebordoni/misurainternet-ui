MisuraInternet Speedtest � un tool per verificare le prestazioni della rete, in modo analogo ad altri speedtest disponibili in rete.
MisuraInternet Speedtest � una applicazione web accessibile via browser. Offre un'interfaccia in cui � possibile interagire con
i servizi e i software di misurainternet.it. 
In particolare � possibile visualizzare lo stato di Nemesys quando � in esecuzione sulla propria macchina.
Per maggiori informazioni sul software Nemesys, andare sul sito misurainternet.it.
La funzionalit� principale dell'applicazione � quella di testare la connessione ad internet, ottenendo dei valori di ping, download e upload
che offrono informazioni sulle prestazioni della rete. 

Informazioni tecniche:
Questo progetto contiene un Web Server realizzato con l'ausilio di Node.JS e npm. Il server mette a dispozione l'interfaccia e lo script
che viene eseguito sul client.

Dal sito ufficiale di Node.js:
	Node.js� � un runtime Javascript costruito sul motore JavaScript V8 di Chrome.
	Node.js usa un modello I/O non bloccante e ad eventi, che lo rende un framework leggero ed efficiente. 
	L'ecosistema dei pacchetti di Node.js, npm, � il pi� grande ecosistema di librerie open source al mondo.

Per maggiori informazioni su Node.js e npm, andare sui rispettivi siti ufficiali.
L'interfaccia � realizzata in React, una libreria JavaScript creata da Facebook per realizzare 
interfacce responsive e scalabili.

L'utilizzo di MisuraInternet Speedtest sulla propria macchina � inteso a fini di sviluppo e di testing. 
L'applicazione rilasciata in versione definitiva � in esecuzione ed � disponibile sul sito misurainternet.it. 

Se si � intenzionati ad eseguire MisuraInternet Speedtest sulla propria macchina, di seguito sono riportate tutte le informazioni necessarie.

Requisiti:
- Installare Git. Sar� necessario per scaricare e gestire il codice del progetto.
- Installare Node.js. Durante l'installazione dovrebbe essere installato anche npm, 
  necessario per l'esecuzione dell'applicazione. Assicurarsi che sia installato correttamente.

Istruzioni passo passo per creare l'ambiente di sviluppo sulla tua macchina:

- Usare Git per clonare il progetto da GitHub. Usando Git da linea di comando, lanciare "git clone https://github.com/fondazionebordoni/misurainternet-ui.git"
- Dal terminale, navigare nella cartella di root del progetto appena clonato "misurainternet-ui"
- Installare i package del progetto con il comando "npm install". I package richiesti dal progetto sono descritti nel file "package.json"

Adesso sar� possibile eseguire il web server, effettuando i seguenti passaggi:
- Aprire una nuova finestra del terminale e navigare nella cartella di root del progetto.
- Usare il comando "npm start". Questo avvier� il web server e l'applicazione React. Dopo pochi istanti si aprir� il browser di default con la pagina dell'applicazione.

nota: Il web server render� disponibile l'applicaizone sulla porta 3000. Per accedervi dalla macchina stessa, digitare "localhost:3000"
      nella barra degli indirizzi di un qualsiasi browser.

Questa applicazione NON � in grado di effettuare i test autonomamente. Necessita di un server di test per funzionare.

- Se si vogliono usare i server online di MisuraInternet, � necessario abilitare i CORS sul browser che si sta utilizzando.
  Con i browser pi� comuni pu� essere fatto facilmente tramite una estensione di terze parti.
- E' possibile scaricare un server di test dal repository https://github.com/fondazionebordoni/misurainternet-speedtest.
  In questo modo si pu� effettuare il test su una rete locale.
  Per configurare l'applicazione per usare un server locale, � sufficiente conoscere l'indirizzo ip della macchina su cui � in esecuzione il server.
  L'ip va inserito direttamente nel codice. 
  Aprire il file public/speedtest.js e andare alla riga di codice 674. Sostituire l'ip con quello del computer su cui � in ascolto il server di test.