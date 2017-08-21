import React, { Component } from 'react';
import Intestazione from './Intestazione';
import MisuraCorrente from './MisuraCorrente';
import Riepilogo from './Riepilogo';
import Notifica from './Notifica'

class App extends Component {
  constructor(props) {
    super(props);
    this.state={valore: 0}
    this.componentDidMount=this.componentDidMount.bind(this);
  }

  componentDidMount() {
    var ws=new WebSocket('ws://echo.websocket.org/');
    ws.onopen=function(){
      ws.send(Number((Math.random()*5) + 95).toFixed(2));
    }
    ws.onmessage=function(message){
      this.setState({valore: message.data});
      ws.send(Number((Math.random()*5) + 95).toFixed(2));

    }.bind(this)
  }
  render() {
    var rows = [];
    rows.push(<li className="list-group-item"><Notifica text={"Notifica 1"}  /></li>);
    rows.push(<li className="list-group-item"><Notifica text={"Notifica 2"}  /></li>);
    rows.push(<li className="list-group-item"><Notifica text={"Notifica 3"}  /></li>);
    return (
      <div>
        <Intestazione />
        <MisuraCorrente
          value={this.state.valore}
          pingValue={0}
          downloadValue={0}
          uploadValue={0}
          />
        <Riepilogo
        misCorrenti={2}
        misTotali={96}
        dataPing={[ [1.0, 100.0], [2.0, 60.0]]}
        dataDownload={[ [1.0, 40.0], [2.0, 30.0]]}
        dataUpload={[ [1.0, 30.0], [2.0, 40.0]]}
        notifiche={rows}
          />
      </div>
    );
  }
}

export default App;
