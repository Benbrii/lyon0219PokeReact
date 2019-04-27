/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Game.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import Map from './Map/Map';

const reqTiles = require.context('../../assets/tiles', true, /\.png$/);
const reqPokemons = require.context('../../assets/pokemons', true, /\.png$/);

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersPos: [],
    };

    this.asyncKeys = [];
    this.controls = [38, 40, 37, 39, 67, 87, 83, 65, 68, 67];
  }

  componentDidMount() {
    const { players } = this.props;
    for (let i = 0; i < Object.keys(this.controls[0]).length * (players || 1); i += 1) {
      this.asyncKeys.push(false);
    }
    document.body.addEventListener('keydown', this.keyPressed);
    document.body.addEventListener('keyup', this.keyReleased);
    this.loadTiles(reqTiles.keys());
    this.loadPokemons(reqPokemons.keys());
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.keyPressed);
    document.body.removeEventListener('keyup', this.keyReleased);
  }

  loadTiles = (tilesKeys) => {
    const tiles = tilesKeys.sort((a, b) => a.split('-')[0].substring(2, a.split('-')[0].lenght) - b.split('-')[0].substring(2, b.split('-')[0].lenght));
    document.head.childNodes.forEach((node) => {
      if (node.id === 'tileSet') {
        node.remove();
      }
    });
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'tileSet';
    let css = '';
    for (let i = 0; i < tiles.length; i += 1) {
      const fileZIndex = tiles[i].split('-')[2].split('.').slice()[0];
      css += `.tile-${i} {background-image: url(${reqTiles(tiles[i], true)});\n z-index: ${parseInt(fileZIndex.substring(1, fileZIndex.length), 10)}}\n`;
    }
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  loadPokemons = (pokeKeys) => {
    document.head.childNodes.forEach((node) => {
      if (node.id === 'pokeSet') {
        node.remove();
      }
    });
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'pokeSet';
    let css = '';
    for (let i = 0; i < pokeKeys.length; i += 1) {
      const fileZIndex = pokeKeys[i].split('-')[2].split('.').slice()[0];
      css += `.tile-${i + 9000} {background-image: url(${reqPokemons(pokeKeys[i], true)});\n z-index: ${parseInt(fileZIndex.substring(1, fileZIndex.length), 10)}}\n`;
    }
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  keyPressed = (e) => {
    const keys = e.keyCode;
    const size = this.controls.length;

    for (let i = 0; i < size; i += 1) {
      if (this.controls[i] === keys && !this.asyncKeys[i]) {
        this.asyncKeys[i] = keys;
        this.setState({ asyncKeys: this.asyncKeys });
        break;
      }
    }
  }

  keyReleased = (e) => {
    const keys = e.keyCode;
    const size = this.controls.length;

    for (let i = 0; i < size; i += 1) {
      if (this.controls[i] === keys && this.asyncKeys[i]) {
        this.asyncKeys[i] = false;
        this.setState({ asyncKeys: this.asyncKeys });
        break;
      }
    }
  }

  createGameInstances = (num) => {
    const instances = [];
    for (let i = 0; i < num; i += 1) {
      instances.push(<div className="instanceContainer"><Map controller={i} players={num} reportPosition={this.getPlayersPosition} getPlayersPosition={this.sendPlayerPositions} controls={this.controls.slice(4 * i, this.controls.length * (0.5 * (i + 1)))} asyncKeys={this.asyncKeys.slice(4 * i, this.controls.length * (0.5 * (i + 1)))} /></div>);
    }
    return instances;
  }

  getPlayersPosition = (data) => {
    const { playersPos } = this.state;
    if (data.player === 0) { playersPos[0] = { x: data.x, y: data.y }; }
    if (data.player === 1) { playersPos[1] = { x: data.x, y: data.y }; }
    this.setState({ playersPos });
  }

  sendPlayerPositions = player => this.state.playersPos[player];

  render() {
    const { players } = this.props;
    return (
      <div className="Background" style={{ display: 'block' }}>

        <div className="LeftMenu">
          <NavLink to="/profil">
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
          {this.createGameInstances(players || 1)}
        </div>

      </div>
    );
  }
}

export default Game;
