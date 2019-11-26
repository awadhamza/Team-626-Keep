import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import HomePage from './components/HomePage'
import Archive from './components/Archive'
import Login from './components/Login'

function App() {

  return (
    <Router>
      <div className="App">
        <Route exact path = "/" component = {HomePage} />
        <Route exact path = "/Archive" component = {Archive} />
        <Route exact path = "/Login" component = {Login} />
      </div>
    </Router>
  );
}

export default App;