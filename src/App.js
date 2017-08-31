import React, {Component} from 'react';
import Intestazione from './Intestazione';
import MisuraCorrente from './MisuraCorrente';
import Riepilogo from './Riepilogo';
import Notifica from './Notifica'
import ContenitoreIconeDiStato from './ContenitoreIconeDiStato';

//se non si collega a nemesis all'avvio faccio partire mist.

var res = [];
var listelements = [];
var client_id = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostra: true,
      valore: 0,
      misCorrenti: 0,
      //misure: [],
      hdr: "MisuraInternet UI",
      par: <p>Interfaccia web per il monitoraggio della qualità degli accessi ad Internet da postazione fissa realizzato da AGCOM in collaborazione con la Fondazione Ugo Bordoni ed il supporto dell’Istituto Superiore delle Comunicazioni.</p>,

      unitMeasure: "",
      gaugeColor: "#0275d8",
      pingValue: 0,
      downloadValue: 0,
      uploadValue: 0,
      notifiche: [],

      statoEthernet: "-",
      statoCpu: "-",
      statoRam: "-",
      statoWifi: "-",

      cardEthernet: "",
      cardCpu: "",
      cardRam: "",
      cardWifi: " "
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateTachometer = this.updateTachometer.bind(this);
    this.readMessage = this.readMessage.bind(this);
    this.displayTestN = this.displayTestN.bind(this);
    this.profilation = this.profilation.bind(this);
    this.displayMeasureView = this.displayMeasureView.bind(this);
  }

  componentDidMount() {
    var ws = new WebSocket('ws://localhost:8080');

    ws.onopen = function() {
      var req = {
        request: "currentstatus"
      };
      this.send(JSON.stringify(req));
    }
    ws.onmessage = function(message) {
      var msg = JSON.parse(message.data);
      this.readMessage(msg);

    }.bind(this)

    /*  ws.onclose = function (event) {
        /**
         se la chiusura è stata causata da qualche errore

        if (event.code != 1000) {
            this.displayError(event.code);
        }
    }; */
  }

  readMessage(msg) {

    switch (msg.type) {
      case "sys_resource": //
        this.sysResource(msg.content.resource, msg.content.state, msg.content.info);
        break;
      case "wait": //    /serial=id_client&
        this.displayWaitView(msg.serial, msg.content.message, msg.content.seconds);
        break;
      case "end":
        this.displayEndView();
        break;
      case "notification":
        this.displayNotification(msg.content.error_code, msg.content.message);
        break;
      case "error":
        this.displayError(msg.content);
        break;
      case "measure": //*
        this.displayMeasureView(msg.content.test_type, msg.content.bw);
        break;
      case "tachometer": //
        this.updateTachometer(msg.content.value);
        break;
      case "profilation": //
        this.profilation(msg.content.done);
        break; 
      case "result": //*
        this.displayResult(msg.content.test_type, msg.content.result, msg.content.error);
        break;
      case "test": //*
        this.displayTestN(msg.content.n_test, msg.content.n_tot, msg.content.retry);
        break;
      default:
        console.log("Wrong message");
    }
  }

  displayNotification(error_code, message) {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    if (h < 10) {
      h = '0' + h;
    }
    if (m < 10) {
      m = '0' + m;
    }

    var n = Math.ceil(Math.random() * 100000); //Round a number upward to its nearest integer.
    var collapse = 'collapse' + n;
    var heading = 'heading' + n;

    listelements.push(
      <li className="list-group-item">
        <Notifica text={h + ":" + m + '-' + message + '(codice errore: ' + error_code + ')'}/>
      </li>
    );

    if (listelements.length > 10) {
      listelements.splice(0, 1); //limito a 10 la lista di notifiche mostrate nella pagina
    }
    this.setState({notifiche: listelements});
  }

  displayResult(test_type, result, error) {
    this.setState({valore: 0});
    if (error) {
      this.setState({
        par: "Test di " + test_type + " fallito: " + error + ". Nuovo tentativo fra pochi secondi..."
      });
    } else {
      switch (test_type) {
        case "ping":
          {
            this.setState({
              par: "Valore misurato: " + result.toFixed(2) + " ms"
            });
            this.setState({pingValue: result.toFixed(2)});
            break;
          }
        case "upload":
          {
            this.setState({
              par: "Valore misurato: " + (result / 1000).toFixed(2) + " Mbit/s"
            });
            this.setState({
              uploadValue: (result / 1000).toFixed(2)
            });
            break;
          }
        case "download":
          {
            this.setState({
              par: "Valore misurato: " + (result / 1000).toFixed(2) + " Mbit/s"
            });
            this.setState({
              downloadValue: (result / 1000).toFixed(2)
            });
            break;
          }
      }
    }
  }

  updateTachometer(value) {
    this.setState({valore: value.toFixed(2)});
    res.push(value);
    this.setState({
      misure: this.state.misure.concat([
        [res.length, value]
      ])
    });
  }

  displayTestN(n_test, n_tot, retry) {
    if (retry === "True") {
      this.setState({
        par: "Misura ripresa dopo l'interruzione. Test " + n_test + " di " + n_tot + "."
      });
    } else {
      this.setState({
        par: "Test " + n_test + " di " + n_tot + "."
      });
    }
  }

  profilation(done) {
    this.setState({mostra: false});
    if (done === "False") {
      this.setState({par: "Profilazione in corso..."});
    } else {
      this.setState({mostra: true});
    }
  }

  sysResource(resource, state, info) {
    switch (state) {
      case "error":
        {
          switch (resource) {
            case "ethstatus":
              {
                this.setState({statoEthernet: "Errore"});
                this.setState({cardEthernet: "card-danger"});
                break;
              }
            case "cpustatus":
              {
                this.setState({statoCpu: "Errore"});
                this.setState({cardCpu: "card-danger"});
                break;
              }
            case "ramstatus":
              {
                this.setState({statoRam: "Errore"});
                this.setState({cardRam: "card-danger"});
                break;
              }
            case "wifistatus":
              {
                this.setState({statoWifi: "Errore"});
                this.setState({cardWifi: "card-danger"});
                this.break;
              }
          }
        };
        break;
      case "ok":
        {
          switch (resource) {
            case "ethstatus":
              {
                this.setState({statoEthernet: "OK"});
                this.setState({cardEthernet: "card-success"});
                break;
              }
            case "cpustatus":
              {
                this.setState({statoCpu: "OK"});
                this.setState({cardCpu: "card-success"});
                break;
              }
            case "ramstatus":
              {
                this.setState({statoRam: "OK"});
                this.setState({cardRam: "card-success"});
                break;
              }
            case "wifistatus":
              {
                this.setState({statoWifi: "OK"});
                this.setState({cardWifi: "card-success"});
                this.break;
              }
          }
        }
      default:
        {}
    }
  }

  displayWaitView(serial, message, seconds) {

    this.setState({par: message})

    if (serial && serial.length > 0) {

      //manda solo la richiesta e i file json di risposta  atom-beautify/
      this.setState({dataPing: "/get_client_detail/?serial=id_client&type=ping"});
      this.setState({dataDownload: "/get_client_detail/?serial=id_client&type=download"});
      this.setState({dataUpload: "/get_client_detail/?serial=id_client&type=upload"});
      //this.setState({: "/get_measures_detail/?serial=id_client&type=numMeasures"});
      //this.setState({: "/get_measures_detail/?serial=id_client&type=licenseInfo"});

      //this.setState({par: ""}

      //$('#par').text("Sono state effettuate " + response.up.length + " misurazioni su " + n_tot + ". " + msg);
    }
  }

  displayEndView() {
    this.setState({hdr: "Nemesys ha terminato le sue misurazioni"});
    this.setState({par: "Le misurazioni sono state completate. Accedi all'area personale per scaricare il certificato."});
  }

  displayMeasureView(test_type, bw) {
    this.setState({hdr: "Nemesys - Misurazione in corso"});
    this.setState({par: "Inizio test..."});

    switch (test_type) {
      case "upload":
        {
          this.setState({gaugeColor: '#4eb14e'})
          this.setState({hdr: "Test di upload in corso..."});
          this.setState({unitMeasure: "Mbit/s"});
        }
        break;
      case "download":
        {
          this.setState({gaugeColor: '#66a0fd'})
          this.setState({hdr: "Test di download in corso..."});
          this.setState({unitMeasure: "Mbit/s"});
        }
        break;
      case "ping":
        {
          this.setState({gaugeColor: '#ffcc00'});
          this.setState({hdr: "Test di latenza in corso..."});
          this.setState({unitMeasure: "ms"});
        }
        break;
      default:
        this.setState({hdr: "Errore imprevisto"});
    }
  }

  displayError(errorMsg) {
    document.getElementById("titolo").innerHTML = "Nemesys - Errore";
    this.setState({hdr: "Impossibile connettersi a Nemesys"});

    switch (errorMsg) {
      case 1006:
        {
          this.setState({
            par: <p>
                <b>Assicurati di aver scaricato ed installato Nemesys: una volta completata l&#039; installazione, potrai vedere l&#039; avanzamento delle tue misure su questa pagina.</b>
                <br/><br/>
                Se hai già installato Nemesys e visualizzi questa schermata, prova a riavviare il computer.
                <br/><br/>Qualora continuassi a visualizzare questo messaggio, l&#039; installazione o l&#039; avvio di Nemesys potrebbero non essere andati a buon fine:
                <a href="/supporto/">
                  contatta il nostro helpdesk.</a>
              </p>
          });
        }
        break;
      default:
        this.setState({par: errorMsg});
    }

    this.setState({mostra: false});
  }

  render() {
    return (
      <div>
        <Intestazione hdr={this.state.hdr} par={this.state.par}/>
        <ContenitoreIconeDiStato statoEthernet={this.state.statoEthernet} statoCpu={this.state.statoCpu} statoRam={this.state.statoRam} statoWifi={this.state.statoWifi} cardEthernet={this.state.cardEthernet} cardCpu={this.state.cardCpu} cardRam={this.state.cardRam} cardWifi={this.state.cardWifi}/>
        <MisuraCorrente value={this.state.valore} unitMeasure={this.state.unitMeasure} gaugeColor={this.state.gaugeColor} pingValue={this.state.pingValue} downloadValue={this.state.downloadValue} uploadValue={this.state.uploadValue}/>
        <Riepilogo misCorrenti={2} misTotali={96} dataPing={[
          [
            1.0, 100.0
          ],
          [2.0, 60.0]
        ]} dataDownload={this.state.misure} dataUpload={[
          [
            1.0, 30.0
          ],
          [2.0, 40.0]
        ]} notifiche={this.state.notifiche}/>
      </div>
    );
  }
}

export default App;

/*
render() {
  return (
    <div>
      <Intestazione hdr={this.state.hdr} par={this.state.par} />
      {(this.state.mostra) ? (
          <div>
      <MisuraCorrente
        value={this.state.valore}
        unitMeasure={this.state.unitMeasure}
        gaugeColor = {this.state.gaugeColor}
        pingValue={this.state.pingValue}
        downloadValue={this.state.downloadValue}
        uploadValue={this.state.uploadValue}
        />
      <Riepilogo
      misCorrenti={2}
      misTotali={96}
      dataPing={[ [1.0, 100.0], [2.0, 60.0]]}
      dataDownload={this.state.misure}
      dataUpload={[ [1.0, 30.0], [2.0, 40.0]]}
      notifiche={this.state.notifiche}
        /> </div>)
         : <div></div>}
    </div>
  );
}
}

export default App;
*/
