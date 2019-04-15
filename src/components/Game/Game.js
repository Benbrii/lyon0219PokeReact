import React, { Component } from 'react';
import Map from './Map/Map';
import Character from './Map/Tiles/Character'

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="gameContainer">
        <Map />
        <Character />
      </div>
    );
  }
}

export default Game;
