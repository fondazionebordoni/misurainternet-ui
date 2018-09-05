# misurainternet-ui

MisuraInternet Speedtest è una applicazione desktop per verificare la prestazioni della propria rete autorizzata dall' [AGCOM](https://www.agcom.it/).
Attualmente è in sviluppo una versione web utilizzabile via browser.

## Table of Contents

- [Funzionalità](#Funzionalità)
- [Informazioni tecniche](#Informazioni tecniche)
- [Requisiti](#Requisiti)
- [Istruzioni](#Istruzioni)
- [Server](#Server)
- [English instructions](#English instructions)


## Funzionalità

MisuraInternet Speedtest offre un'interfaccia in cui è possibile interagire con
i servizi e i software di misurainternet.it. 
In particolare è possibile visualizzare lo stato di Nemesys quando è in esecuzione sulla propria macchina.

La funzionalità principale dell'applicazione è quella di testare la connessione ad internet, ottenendo dei valori di latenza throughput che offrono informazioni sulle prestazioni della rete.

Per maggiori informazioni sul software Nemesys, andare sul sito [misurainternet](https://www.misurainternet.it/).
Per il repository andate su [git nemesys](https://github.com/fondazionebordoni/nemesys).


## Informazioni tecniche

Questo progetto contiene un Web Server realizzato con l'ausilio di [Node.js](https://nodejs.org/it/) e [npm](https://www.npmjs.com/).
Il server mette a dispozione l'interfaccia e lo script che viene eseguito sul client.

L'interfaccia è realizzata in [React](https://reactjs.org/).

L'utilizzo della versione web di MisuraInternet Speedtest sulla propria macchina è inteso a fini di sviluppo e di testing. 
L'applicazione desktop rilasciata in versione definitiva è in esecuzione ed è disponibile sul sito misurainternet.it. 


## Requisiti

* Installare/aggiornare Git all'ultima versione disponibile. Necessario per scaricare e gestire il codice del progetto.
* Installare/aggiornare Node.js all'ultima versione LTS disponibile.
* Aggiornare npm all'ultima versione disponibile. Necessario per l'esecuzione dell'applicazione.


## Istruzioni

* Usare Git per clonare il progetto da GitHub. Usando Git Bash scrivere:
`git clone https://github.com/fondazionebordoni/misurainternet-ui.git`
* Dalla bash, navigare nella cartella del progetto appena clonato `misurainternet-ui`
* Installare i package del progetto con il comando `npm install`.
  I package richiesti dal progetto sono descritti nel file `package.json`

Adesso sarà possibile eseguire il web server, effettuando i seguenti passaggi:
* Sempre dalla bash, usare il comando `npm start`.
  Questo avvierà il web server e l'applicazione React. Dopo pochi istanti si aprirà il browser di default con la pagina dell'applicazione.

>Note: il web server renderà disponibile l'applicaizone sulla porta 3000.
>Per accedervi da qualsiasi browser, digitare nella barra degli indirizzi `localhost:3000`.


## Server

>Note: Questa applicazione non è in grado di effettuare i test autonomamente.
>Necessita di un server di test per funzionare.

Se si vogliono usare i server online di MisuraInternet, è necessario abilitare i CORS sul browser che si sta utilizzando.
Con i browser più comuni può essere fatto facilmente tramite una estensione di terze parti.

In alternativa è possibile scaricare un server di test dal repository [misurainternet-speedtest](https://github.com/fondazionebordoni/misurainternet-speedtest).
In questo modo si possono effettuare i test su una rete locale.
Per configurare tale server consultare il suo file README.md


# English instructions

Requirements:
- Git installed
- Node.js with npm installed

Instructions for setting up development environment on your machine:

1- Use Git to clone the project from GitHub. Launch "git clone https://github.com/fondazionebordoni/misurainternet-ui.git"
2- From the terminal, navigate to the cloned project root directory "misurainternet-ui"
3- Enter the command "npm install" and wait for it downloading all packages

Instructions for launch the application:
1- From the terminal, navigate to the project root directory
5- Use the command "npm start". It will open your default web browser with the page of application

note: the application will be available to any browser on you machine.
Type "localhost:3000" in the address bar to open it.

This is not a standalone application. This web app contains only the client side part of the speedtest.
This application is intendend for debugging and testing purposes only.
If you want to perform a speedtest in your local network, you can download the test server on GitHub: https://github.com/fondazionebordoni/misurainternet-speedtest
You must configure this application to use a local server. Open the file public/speedtest.js and edit lines 20 and 21.





This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find its guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).