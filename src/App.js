import React, { Component } from 'react';
import Intestazione from './Intestazione';
import MisuraCorrente from './MisuraCorrente';
import Riepilogo from './Riepilogo';

class App extends Component {
  render() {
    return (
      <div>
        <Intestazione />
        <MisuraCorrente />
        <Riepilogo />
      </div>
    );
  }
}

export default App;
