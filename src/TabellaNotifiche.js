import React from 'react';
import Notifica from './Notifica'

class TabellaNotifiche extends React.Component {
  render(){
    var rows = [];
    rows.push(<li className="list-group-item"><Notifica text={"Notifica 1"}  /></li>);
    rows.push(<li className="list-group-item"><Notifica text={"Notifica 2"}  /></li>);
    rows.push(<li className="list-group-item"><Notifica text={"Notifica 3"}  /></li>);

    return(
      <div className="mt-1 mb-2">
      <h5>Notifiche</h5>
      <div>Qui verranno segnalate eventuali notifiche ed errori nell' esecuzione di Nemesys</div>
      <ul className="list-group mt-1">
      {rows}
      </ul>
      </div>
    )
  }
}

export default TabellaNotifiche;
