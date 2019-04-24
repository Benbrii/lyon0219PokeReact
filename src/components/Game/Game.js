import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Game.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import Map from './Map/Map';
import { menu } from './audio';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  createGameInstances = (num) => {
    const instances = [];
    for (let i = 0; i < num; i++) {
      instances.push(<div className="instanceContainer"><Map controller={i} reportPosition={this.getPlayersPosition} /></div>);
    }
    return instances;
  }

  getPlayersPosition = (data) => {

  }


  render() {
    return (
      <div className="Background" style={{ display: 'block' }}>

        <div className="LeftMenu">
          <NavLink to="/menu" onClick={menu.play()}>
            <button type="button" className="RoundBtn">
              <FontAwesomeIcon icon={faUser} />
            </button>
          </NavLink>
        </div>

        <div className="RightMenu">
          <NavLink to="/menu">
            <button type="button" className="RoundBtn">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </NavLink>
          <NavLink to="/commands">
            <button type="button" className="RoundBtn"> ? </button>
          </NavLink>
        </div>

        <div className="gameContainer">
          {this.createGameInstances(this.props.players || 1)}
        </div>

      </div>
    );
  }
}

export default Game;
