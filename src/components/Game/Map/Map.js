/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import MapRow from './MapRow';
import Player from './Tiles/Character';
import { ableToMove } from '../utils';
import Capture from '../../Pokedex/Capture';
import { Pokemon } from '../character';

const reqMaps = require.context('../../../assets/maps', true, /\.txt$/);
const reqTiles = require.context('../../../assets/tiles', true, /\.png$/);

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: [],
      view: [],
      viewWidth: 13,
      viewHeight: 13,
      viewX: 11,
      viewY: 17,
      winner: 'none',
      characterDirection: 'CharacterDown0',
      pokemons: [],
    };

    this.theme = {
      width: '832px',
      height: '832px',
      overflow: 'hidden',
      margin: '0 auto',
      textAlign: 'center',
    };

    this.loaded = false;
    this.asyncKeys = [];
    this.debugMode = true;
    this.gamepads = [];
    this.scrollSpeed = 8;
    this.lastScroll = 0;
    if (this.debugMode) {
      this.renderCounter = 0;
      this.loopCounter = 0;
    }
  }

  componentWillMount() {
    this.init();
  }

  componentWillUnmount() {
    this.end();
  }

  init = async () => {
    this.configInstance();
    await this.loadMap(reqMaps('./map1.txt', true));
    await this.loadTiles(reqTiles.keys());
    this.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    this.running = setInterval(this.run, 1000 / 30);
  }

  end = () => {
    clearInterval(this.running);
    this.asyncKeys = null;
    this.running = null;
    this.renderCounter = null;
    this.loaded = null;
  }

  configInstance = () => {
    const { controller } = this.props;
    this.gamepad = controller;
  }

  loadMap = async (mapUri) => {
    await fetch(mapUri).then(res => res.json()).then(resJson => this.setState({
      map: [...resJson],
    }));
    this.loaded = true;

    // Will move //


    const {
      viewY, viewX, viewWidth, viewHeight, map,
    } = this.state;
    this.pokemon1 = new Pokemon(55, 'greuf', 16, 20, map);
    this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight);
  };

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
      css += `.tile-${i} {background-image: url(${reqTiles(tiles[i], true)});\n z-index: ${parseInt(fileZIndex.substring(1, fileZIndex.length))}}\n`;
    }
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  checkGamepad = (gamepadId) => {
    this.gamepads = navigator.getGamepads ? navigator.getGamepads()
      : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!this.gamepads[gamepadId]) {
      return;
    }
    const step = 1;

    const gp = this.gamepads[gamepadId];
    if (gp.buttons[12].pressed) {
      this.moveTo('up', step);
    } else if (gp.buttons[13].pressed) {
      this.moveTo('down', step);
    } else if (gp.buttons[14].pressed) {
      this.moveTo('left', step);
    } else if (gp.buttons[15].pressed) {
      this.moveTo('right', step);
    } else if (gp.axes[0] === 1) {
      this.moveTo('right', step);
    } else if (gp.axes[0] === -1) {
      this.moveTo('left', step);
    } else if (gp.axes[1] === 1) {
      this.moveTo('down', step);
    } else if (gp.axes[1] === -1) {
      this.moveTo('up', step);
    }
  }

  checkKeyboard = () => {
    let step = 1;
    const { controls, asyncKeys } = this.props;
    for (let i = 0; i < controls.length; i += 1) {
      if (controls[i] === asyncKeys[i]) {
        if (asyncKeys[i] === controls[0]) {
          this.moveTo('up', step);
          break;
        }
        if (asyncKeys[i] === controls[1]) {
          this.moveTo('down', step);
          break;
        }
        if (asyncKeys[i] === controls[2]) {
          this.moveTo('left', step);
          break;
        }
        if (asyncKeys[i] === controls[3]) {
          this.moveTo('right', step);
          break;
        }
        if (this.asyncKeys[i] === null) {
          step = 0;
          this.moveTo('stay', step);
          break;
        }
      }
    }
  }

  moveTo = (direction, step) => {
    if (performance.now() - this.lastScroll < 1000 / this.scrollSpeed) return;
    const {
      map, viewWidth, viewHeight,
    } = this.state;
    let { viewY, viewX, characterDirection } = this.state;
    if (!ableToMove({ x: viewX + 6, y: viewY + 6 }, direction, step, map)) return;
    switch (direction) {
      case 'up':
        viewY -= step;
        characterDirection = 'CharacterUp1';
        break;

      case 'down':
        viewY += step;
        characterDirection = 'CharacterDown1';
        break;

      case 'left':
        viewX -= step;
        characterDirection = 'CharacterLeft1';
        break;

      case 'right':
        viewX += step;
        characterDirection = 'CharacterRight1';
        break;

      default:
        return;
    }
    this.setState({
      viewY,
      viewX,
      characterDirection,
    },
    () => {
      this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight);
      this.lastScroll = performance.now();
      const { controller, reportPosition } = this.props;
      reportPosition({ player: controller, x: viewX + 6, y: viewY + 6 });
    });
  }

  updateViewMap = (matrix, offsetX, offsetY, width, height) => {
    if (offsetX + width > matrix[0].length) return;
    if (offsetY + height > matrix.length) return;
    const subMatrix = [];
    for (let i = offsetY; i < height + offsetY; i += 1) {
      const index = subMatrix.push(JSON.parse(JSON.stringify(matrix[i]))) - 1;
      subMatrix[index] = subMatrix[index].slice(offsetX, offsetX + width);
    }
    this.setState({ view: [...subMatrix] });
    // eslint-disable-next-line consistent-return
    return subMatrix;
  }

  run = () => {
    const {
      map, viewX, viewY, viewWidth, viewHeight, view,
    } = this.state;
    if (this.debugMode) this.loopCounter += 1;

    let { winner } = this.state;

    if (this.pokemon1 && this.loaded) {
      this.pokemon1.run();


      if (this.pokemon1.y > viewY && this.pokemon1.y < viewY + viewHeight && this.pokemon1.x > viewX && this.pokemon1.x < viewX + viewWidth) {
        const hop = this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight);
        // console.log(hop)
        hop[this.pokemon1.y - viewY][this.pokemon1.x - viewX].push(1174);
        if (view[Math.floor(view.length / 2)][Math.floor(view.length / 2)].includes(1174)) {
          winner = 'block';
          clearInterval(this.running);
        }
        this.setState({ view: hop, winner });
      }
    }
    const { controller } = this.props;
    this.checkKeyboard();
    this.checkGamepad(controller);
  }

  debug = () => {
    if (!this.debugMode) return;
    this.renderCounter += 1;
    // eslint-disable-next-line consistent-return
    return (
      <h3 style={{
        position: 'fixed', bottom: 10, right: 10, zIndex: 1000,
      }}
      >
        {`Render No ${this.renderCounter} Loop No ${this.loopCounter}`}

      </h3>
    );
  }

  render() {
    const { view, winner, characterDirection } = this.state;
    const { asyncKeys } = this.props;
    return (
      <div style={this.theme}>
        {this.debugMode ? this.debug() : null}
        {this.loaded ? view.map((row, i) => (
          <MapRow data={row} index={i} key={`row-${i + 1}`} />
        )) : <h1 style={{ margin: '50% auto' }}>LOADING..</h1>}
        <Player />
        <Capture winner={winner} />
        <Player activeKeys={asyncKeys} direction={characterDirection} />
      </div>
    );
  }
}

export default Map;
