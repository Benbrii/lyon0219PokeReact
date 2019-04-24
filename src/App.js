import React, { Component } from 'react';
import {
  Route, Switch, BrowserRouter, NavLink,
} from 'react-router-dom';
import Home from './components/Home/Home';
import Game from './components/Game/Game';
import Pokedex from './components/Pokedex/Pokedex';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <div>
          <BrowserRouter>

            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/play" component={Game} />
              <Route path="/pokedex" component={Pokedex} />
            </Switch>
            <NavLink to="/play">
              {' '}
              <button
                style={{
                  backgroundColor: 'red', border: '5px solid black', height: '200px', width: '600px', fontSize: '10vh', marginTop: '20%',
                }}
                type="button"
              >
                {' '}
Play
                {' '}

              </button>
              {' '}
            </NavLink>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
