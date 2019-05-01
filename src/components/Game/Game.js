import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Game.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import Map from './Map/Map';

const reqTiles = require.context('../../assets/tiles', true, /\.png$/);
const reqPokemons = require.context('../../assets/pokemons', true, /\.png$/);
const reqTrainer = require.context('../../assets/characters', true, /\.png$/);

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      pokemons: [],
      bonus: 1,
      bonus2: 1,
      asyncKeys: [],
    };

    this.controls = [38, 40, 37, 39, 96, 110, 90, 83, 81, 68, 67, 86];
  }

  componentDidMount() {
    const { players } = this.props;
    const { asyncKeys } = this.state;
    for (let i = 0; i < Object.keys(this.controls[0]).length * (players || 1); i += 1) {
      asyncKeys.push(false);
    }
    this.setState({ asyncKeys });
    document.body.addEventListener('keydown', this.keyPressed);
    document.body.addEventListener('keyup', this.keyReleased);
    this.loadTiles(reqTiles.keys());
    this.loadPokemons(reqPokemons.keys());
    this.loadTrainer(reqTrainer.keys());
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

  loadTrainer = (trainerKeys) => {
    document.head.childNodes.forEach((node) => {
      if (node.id === 'trainerSet') {
        node.remove();
      }
    });
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'trainerSet';
    let css = '';
    for (let i = 0; i < trainerKeys.length; i += 1) {
      css += `.${trainerKeys[i].substring(2).split('.').shift()} {background-image: url(${reqTrainer(trainerKeys[i], true)});\n z-index: 10}\n`;
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
    const { asyncKeys } = this.state;

    for (let i = 0; i < size; i += 1) {
      if (this.controls[i] === keys && !asyncKeys[i]) {
        asyncKeys[i] = keys;
        this.setState({ asyncKeys });
        break;
      }
    }
  }

  keyReleased = (e) => {
    const keys = e.keyCode;
    const size = this.controls.length;
    const { asyncKeys } = this.state;

    for (let i = 0; i < size; i += 1) {
      if (this.controls[i] === keys && asyncKeys[i]) {
        asyncKeys[i] = false;
        this.setState({ asyncKeys });
        break;
      }
    }
  }


  createGameInstances = (num) => {
    const instances = [];
    const { asyncKeys } = this.state;
    for (let i = 0; i < num; i += 1) {
      instances.push(<div className="instanceContainer"><Map controller={i} players={num} reportPosition={this.getPlayersPosition} getPlayerPosition={this.sendPlayerPositions} controls={this.controls.slice(6 * i, this.controls.length * (0.5 * (i + 1)))} asyncKeys={asyncKeys.slice(6 * i, this.controls.length * (0.5 * (i + 1)))} /></div>);
    }
    return instances;
  }

  getPlayersPosition = (data, poke, updated) => {
    let { pokemons } = this.state;
    const { players } = this.state;
    if (data.player === 0) {
      players[data.player] = { pos: { x: data.x, y: data.y }, profile: data.profile };
      if (poke) pokemons = poke;
      if (updated) this.queued = false;
    } else {
      players[data.player] = { pos: { x: data.x, y: data.y }, profile: data.profile };
      if (poke) {
        pokemons = poke;
        this.queued = true;
      }
    }
    this.setState({ pokemons, players });
  }

  sendPlayerPositions = (player) => {
    const { players, pokemons } = this.state;
    const joueurs = players.filter(p => p.profile.name !== player);
    const out = { joueurs, pokemons, update: this.queued };
    return out;
  };

  render() {
    const { players } = this.props;
    const { bonus, bonus2 } = this.state;
    return (
      <div className="Background" style={{ display: 'block' }}>

        <div className="LeftMenu">
          <NavLink to="/Menu">
            <button type="button" className="RoundBtn">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </NavLink>
        </div>

        <div className="RightMenu">
          <NavLink to={`/profil${players > 1 ? ':multi' : '/profil:'}`}>
            <button type="button" className="RoundBtn">
              <FontAwesomeIcon icon={faUser} />
            </button>
          </NavLink>
          <NavLink to="/commands">
            <button type="button" className="RoundBtn"> ? </button>
          </NavLink>
        </div>
        <button type="button" className="RoundBtn Bonus" style={{ filter: `grayscale(${bonus})` }}> C </button>
        <button type="button" className="RoundBtn Bonus1" style={{ filter: `grayscale(${bonus2})` }}> S </button>

        <div className="gameContainer">
          {this.createGameInstances(players || 1)}
        </div>

      </div>
    );
  }
}

export default Game;
// LF
