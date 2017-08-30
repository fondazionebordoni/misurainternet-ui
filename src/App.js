import React, { Component } from 'react';
import Intestazione from './Intestazione';
import MisuraCorrente from './MisuraCorrente';
import Riepilogo from './Riepilogo';
import Notifica from './Notifica'

var res = [];
var listelements = [];
var client_id = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
        mostra: true,
        valore: 0,
        misure: [],
        hdr: "MisuraInternet UI",
        par: <p>Interfaccia web per il monitoraggio della qualità degli accessi ad Internet da postazione fissa
         realizzato da AGCOM in collaborazione con la Fondazione  Ugo Bordoni ed il supporto dell’Istituto Superiore delle Comunicazioni.</p>,
        //"Interfaccia web per il monitoraggio della qualità degli accessi ad Internet da postazione fissa  realizzato da AGCOM in collaborazione con la Fondazione  Ugo Bordoni ed il supporto dell’Istituto Superiore delle Comunicazioni.",
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
        cardWifi: " ",
        }
    this.componentDidMount=this.componentDidMount.bind(this);
    this.updateTachometer=this.updateTachometer.bind(this);
    this.readMessage=this.readMessage.bind(this);
    this.displayTestN=this.displayTestN.bind(this);
    this.profilation=this.profilation.bind(this);
    this.displayMeasureView=this.displayMeasureView.bind(this);
  }

  componentDidMount() { // il this di componentDidMount è App
    var ws=new WebSocket('ws://localhost:8080');

    ws.onopen=function(){
      var req = {
            request: "currentstatus" //oggetto javascript
        };
        this.send(JSON.stringify(req));
    }
    ws.onmessage=function(message){
      var msg = JSON.parse(message.data);
      this.readMessage(msg); //il this ci va perchè readMessage è un metodo della classe!
      //console.log(this);
    }.bind(this)//lo lega al this di componentDidMount, ovvero App
  }

   readMessage(msg) { //msg è quello che ricevo dal server
        client_id = msg.serial;
        //console.log("CLIENT ID" + client_id);

        switch (msg.type) {
            case "sys_resource": //
                this.sysResource(msg.message.resource, msg.message.state, msg.message.info);
                break;
            case "wait": //    /serial=id_client&
                //this.displayWaitView(msg.message.message, msg.message.seconds);
                break;
            case "end":
                this.displayEndView();
                break;
            case "notification":
                this.displayNotification(msg.message.error_code, msg.message.message);
                break;
            case "error":
                this.displayError(msg.message);
                break;
            case "measure": //*
                this.displayMeasureView(msg.message.test_type, msg.message.bw);
                break;
            case "tachometer": //
              this.updateTachometer(msg.message.value);
                break;
            case "profilation": //
              this.profilation(msg.message.done);
                break;
            case "result": //*
                this.displayResult(msg.message.test_type, msg.message.result, msg.message.error);
                break;
            case "test": //*
              this.displayTestN(msg.message.n_test, msg.message.n_tot, msg.message.retry);
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

      var n = Math.ceil(Math.random() * 100000); //Round a number upward to its nearest integer. Perché ho bisogno di un numero random???
      var collapse = 'collapse' + n;
      var heading = 'heading' + n;

      listelements.push(<li  className="list-group-item"> <Notifica text={h + ":" + m + '-' + message +  '(codice errore: ' + error_code +')'}/> </li>);

      /*$('#accordion').prepend('<div class="panel panel-default"><div class="panel-heading" role="tab" id="' + heading + '"><h5 class="panel-title">' +  //Insert content at the beginning of all <#accordion> elements:
          '<a class="text-danger" data-toggle="collapse" data-parent="#accordion" href="#' + collapse +
          '" aria-expanded="false" aria-controls="' + collapse + '">' + h + ':' + m + ' - ' + message + '</a></h5></div>' +
          '<div id="' + collapse + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + heading + '">' +
          '<a href="#' + error_code + '">Codice errore: ' + error_code + '</a></div></div>');

      var listelements = $('#accordion').children();      */

      if (listelements.length > 10) {
          listelements.splice(0,1); //limito a 10 la lista di notifiche mostrate nella pagina
      }
      this.setState({notifiche: listelements});
  }

    displayResult(test_type, result, error) {
      this.setState({valore: 0});
      if (error) {
          this.setState({par: "Test di " + test_type + " fallito: " + error + ". Nuovo tentativo fra pochi secondi..."});
          //$('#par').text("Test di " + test_type + " fallito: " + error + ". Nuovo tentativo fra pochi secondi...");
      }
      else {
          switch (test_type) {
              case "ping":{
                  this.setState({par: "Valore misurato: " + result.toFixed(2) + " ms"});
                  this.setState({pingValue: result.toFixed(2)});
                  break;
                }
              case "upload":{
                  this.setState({par: "Valore misurato: " + (result/1000).toFixed(2) + " Mbit/s"});
                  this.setState({uploadValue: (result/1000).toFixed(2)});
                  break;
                }
              case "download":{
                  this.setState({par: "Valore misurato: " + (result/1000).toFixed(2) + " Mbit/s"});
                  this.setState({downloadValue: (result/1000).toFixed(2)});
                  break;
                }
          }
      }
  }

    updateTachometer(value) {
      this.setState({valore: value.toFixed(2)});
      res.push(value);
      this.setState({misure: this.state.misure.concat([[res.length, value]])});
    }

    displayTestN(n_test, n_tot, retry) {
    if (retry==="True") {
      this.setState({par: "Misura ripresa dopo l'interruzione. Test " + n_test + " di " + n_tot + "."});
    }
    else {
      this.setState({par: "Test " + n_test + " di " + n_tot + "."});
    }
  }

    profilation(done) { //a cosa serve?
      this.setState({mostra: false});
      if (done==="False") {
            this.setState({par: "Profilazione in corso..."});
        }
      else {
        this.setState({mostra: true});
      }
    }

    sysResource(resource, state, info) {
      switch (state) {
          case "error": {
            switch (resource) {
              case "ethstatus":{
                  this.setState({statoEthernet: "Errore"});
                  this.setState({cardEthernet: "card-danger"});
                break;
              }
              case "cpustatus":{
                this.setState({statoCpu: "Errore"});
                this.setState({cardCpu: "card-danger"});
                break;
              }
              case "ramstatus":{
                this.setState({statoRam: "Errore"});
                this.setState({cardRam: "card-danger"});
                break;
              }
              case "wifistatus":{
                this.setState({statoWifi: "Errore"});
                this.setState({cardWifi: "card-danger"});
                this.
                break;
              }
            }
          }
              ;
              break;
          case "ok": {
            switch (resource) {
              case "ethstatus":{
                  this.setState({statoEthernet: "OK"});
                  this.setState({cardEthernet: "card-success"});
                break;
              }
              case "cpustatus":{
                this.setState({statoCpu: "OK"});
                this.setState({cardCpu: "card-success"});
                break;
              }
              case "ramstatus":{
                this.setState({statoRam: "OK"});
                this.setState({cardRam: "card-success"});
                break;
              }
              case "wifistatus":{
                this.setState({statoWifi: "OK"});
                this.setState({cardWifi: "card-success"});
                this.
                break;
              }
            }
          }
          default: {
              //$(resource).removeClass("card-danger");
              //$(resource).removeClass("card-primary");
          }
      }
  }

  displayWaitView(message, seconds) {
    this.setState({hdr: "Nemesys è in attesa di effettuare una nuova misura."})

    /*
     1) post al backend;
     2) risultato: {up/down/ping:[{time:Date, "value":number}]}
     3) formato del grafico (per ogni grafico):
     [{
     hour:"HH:00 - "(HH+1%24):00",
     val0: prima misura della fascia
     ...
     valN-1: Nesima
     }]
     */
    var msg = message;

    if (client_id && client_id.length > 0) {
      this.setState({dataPing: "/get_measures_detail/?serial=id_client&type=ping"});
      this.setState({dataDownload: "/get_measures_detail/?serial=id_client&type=download"});
      this.setState({dataUpload: "/get_measures_detail/?serial=id_client&type=upload"});
      this.setState({dataUpload: "/get_measures_detail/?serial=id_client&type=numMeasures"});


        /*var measures_ajax_settings = $.extend({
                "data": '{ "serial":"' + client_id + '", "request":"measures_detail"}',
                "datatype": "json"
            },
            ajax_post_settings
        );

        $.ajax(measures_ajax_settings).done( // quando ajax ha finito
            function (res, textStatus, jqXHR) { //Da dove prende i parametri???
                if (textStatus == "success") {
                    console.log(res)

                    var response = res;
                    // var response = JSON.parse(res)[0];

                    var n_tot = response.ntot;

                    $('#par').text("Sono state effettuate " + response.up.length + " misurazioni su " + n_tot + ". " + msg);

                    var datapoints_up = list2datapoints(response.up, n_tot);
                    var datapoints_down = list2datapoints(response.down, n_tot);
                    var datapoints_ping = list2datapoints(response.ping, n_tot);

                    var y_k = Object.keys(datapoints_up[0]).filter(
                        function (element) {
                            return element.startsWith("val");
                        }
                    );
                    var lbs = []
                    for (var i = 1; i <= y_k.length; i++) {
                        lbs.push(i + "° test");
                    }
                    var settings = {
                        xkey: 'hour',
                        ykeys: y_k,
                        labels: lbs,
                        barGap: 1,
                        barSizeRatio: 0.97,
                        hideHover: true,
                        behaveLikeLine: true,
                        parseTime: false,
                        resize: true
                    }

                    $("#up-container").empty();
                    $("#up-container").append('<div id="up-bar"></div>');
                    var settings_d = {
                        element: 'up-bar',
                        data: datapoints_up,
                        yLabelFormat: function (y) {
                            return (y <= 0 ? ('-') : ((y / 1000).toFixed(2) + ' Mbit/s'));
                        },
                        barColors: ['#4eb14e'],
                    }
                    $.extend(settings_d, settings);
                    Morris.Bar(settings_d);

                    $("#down-container").empty();
                    $("#down-container").append('<div id="down-bar"></div>');
                    var settings_u = {
                        element: 'down-bar',
                        data: datapoints_down,
                        yLabelFormat: function (y) {
                            return (y <= 0 ? ('-') : ((y / 1000).toFixed(2) + ' Mbit/s'));
                        },
                        barColors: ['#2b8bd4'],
                    }
                    $.extend(settings_u, settings);
                    Morris.Bar(settings_u);

                    $("#ping-container").empty();
                    $("#ping-container").append('<div id="ping-bar"></div>');
                    var settings_p = {
                        element: 'ping-bar',
                        data: datapoints_ping,
                        yLabelFormat: function (y) {
                            return (y <= 0 ? ('-') : (y.toFixed(2) + ' ms'));
                        },
                        barColors: ['#eb9114'],
                    }
                    $.extend(settings_p, settings);
                    Morris.Bar(settings_p);
                }
            }
        );
    }
}*/

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
            case "upload": {
                this.setState({gaugeColor: '#4eb14e'})
                this.setState({hdr: "Test di upload in corso..."});
                this.setState({unitMeasure: "Mbit/s"});
            }
                break;
            case "download": {
              this.setState({gaugeColor: '#66a0fd'})
              this.setState({hdr: "Test di download in corso..."});
              this.setState({unitMeasure: "Mbit/s"});
            }
                break;
            case "ping": {
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
        case 1006: {
            this.setState({par: <p><b>Assicurati di aver scaricato ed installato Nemesys: una volta completata l&#039; installazione,
             potrai vedere l&#039; avanzamento delle tue misure su questa pagina.</b> <br/><br/>
            Se hai già installato Nemesys e visualizzi questa schermata, prova a
            riavviare il computer. <br/><br/>Qualora continuassi a visualizzare questo messaggio,
            l&#039; installazione o l&#039; avvio di Nemesys potrebbero non essere andati a buon fine:
            <a href="/supporto/"> contatta il nostro helpdesk.</a></p>});
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
        <Intestazione hdr={this.state.hdr} par={this.state.par} />
        <MisuraCorrente
          value={this.state.valore}

          unitMeasure={this.state.unitMeasure}
          gaugeColor = {this.state.gaugeColor}
          pingValue={this.state.pingValue}
          downloadValue={this.state.downloadValue}
          uploadValue={this.state.uploadValue}

          statoEthernet={this.state.statoEthernet}
          statoCpu={this.state.statoCpu}
          statoRam={this.state.statoRam}
          statoWifi={this.state.statoWifi}

          cardEthernet={this.state.cardEthernet}
          cardCpu={this.state.cardCpu}
          cardRam={this.state.cardRam}
          cardWifi={this.state.cardWifi}
          />
        <Riepilogo
        misCorrenti={2}
        misTotali={96}
        dataPing={[ [1.0, 100.0], [2.0, 60.0]]}
        dataDownload={this.state.misure}
        dataUpload={[ [1.0, 30.0], [2.0, 40.0]]}
        notifiche={this.state.notifiche}
          />
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
