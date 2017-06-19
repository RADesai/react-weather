import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
// import './App.css';

// Components
import Home from './components/Home';
import Place from './components/Place';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/:location' component={Place} />
      </Switch>
    );
  }
}

export default App;
