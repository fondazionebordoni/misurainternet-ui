import React from 'react';
import Notifica from './Notifica'

class TabellaNotifiche extends React.Component {
  render() {
    return (
      <div className="mt-2 mb-2">
        <h5>Notifiche</h5>
        <div>Qui verranno segnalate eventuali notifiche ed errori nell esecuzione di Nemesys</div>
        <ul className="list-group mt-1">
          {this.props.notifiche}
        </ul>
      </div>
    )
  }
}

export default TabellaNotifiche;
