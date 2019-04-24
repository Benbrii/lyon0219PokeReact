import React, { Component } from 'react';
import MapRow from './MapRow';
import Player from './Tiles/Character';
import { Character, Pokemon } from '../character';
import { music } from '../audio';

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
    };

    this.keys = {
      keyUp: 38,
      keyDown: 40,
      keyLeft: 37,
      keyRight: 39,
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
    music.play();
  }


  componentWillUnmount() {
    this.end();
    music.src = '';
  }

  init = async () => {
    await this.loadMap(reqMaps('./map1.txt', true));
    await this.loadTiles(reqTiles.keys());
    for (let i = 0; i < Object.keys(this.keys).length; i += 1) {
      this.asyncKeys.push(false);
    }
    document.body.addEventListener('keydown', this.keyPressed);
    document.body.addEventListener('keyup', this.keyReleased);
    // eslint-disable-next-line no-nested-ternary
    this.gamepads = navigator.getGamepads ? navigator.getGamepads()
      : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    this.running = setInterval(this.run, 1000 / 30);
  }

  end = () => {
    document.body.removeEventListener('keydown', this.keyPressed);
    document.body.removeEventListener('keyup', this.keyReleased);
    clearInterval(this.running);
    this.asyncKeys = null;
    this.running = null;
    this.renderCounter = null;
    this.loaded = null;
  }

  run = () => {
    if (this.debugMode) this.loopCounter += 1;
    if (this.pokemon1) {
      this.pokemon1.run();


      if ((this.pokemon1.x < this.state.viewX - 1 && this.pokemon1.x < this.state.viewX + 12) && (this.pokemon1.y >= this.state.viewY && this.pokemon1.y < this.state.viewY + this.state.viewHeight - 1)) {
        console.log(this.state.viewX - this.pokemon1.x, this.pokemon1.y - this.state.viewY);
        this.state.view[this.pokemon1.y - this.state.viewY][this.state.viewX - this.pokemon1.x].push(1174);
        console.log(this.state.view);
      }
    }

    this.checkKeyboard();
    this.checkGamepads(this.props.controller);
  }

  checkGamepads = (gamepadId) => {
    // eslint-disable-next-line no-nested-ternary
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
    const step = 1;
    for (let i = 0; i < Object.keys(this.keys).length; i += 1) {
      if (Object.values(this.keys)[i] === this.asyncKeys[i]) {
        if (this.asyncKeys[i] === 38) {
          this.moveTo('up', step);
          break;
        }
        if (this.asyncKeys[i] === 40) {
          this.moveTo('down', step);
          break;
        }
        if (this.asyncKeys[i] === 37) {
          this.moveTo('left', step);
          break;
        }
        if (this.asyncKeys[i] === 39) {
          this.moveTo('right', step);
          break;
        }
      }
    }
  }

  moveTo = (direction, step) => {
    if (performance.now() - this.lastScroll < 1000 / this.scrollSpeed) return;
    const {
      map, view, viewWidth, viewHeight,
    } = this.state;
    let { viewY, viewX } = this.state;
    switch (direction) {
      case 'up':
        if (!view[Math.floor(view.length / 2 - step)][Math.floor(view.length / 2)]
          .includes(-1)) {
          viewY -= step;
        }
        break;

      case 'down':
        if (!view[Math.floor(view.length / 2 + step)][Math.floor(view.length / 2)].includes(-1)) {
          viewY += step;
        }
        break;

      case 'left':
        if (!view[Math.floor(view.length / 2)][Math.floor(view.length / 2 - step)]
          .includes(-1)) {
          viewX -= step;
          this.left += 5;
        }
        break;

      case 'right':
        if (!view[Math.floor(view.length / 2)][Math.floor(view.length / 2 + step)]
          .includes(-1)) {
          viewX += step;
          this.left -= 5;
        }
        break;

      default:
        return;
    }
    this.setState({
      viewY,
      viewX,
    },
    () => {
      this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight);
      // this.clean();
      this.lastScroll = performance.now();
      this.props.reportPosition({ player: this.props.controller, x: this.state.viewX + 6, y: this.state.viewY + 6 });
    });
  }


  keyPressed = (e) => {
    const keys = e.keyCode;
    const size = Object.keys(this.keys).length;

    for (let i = 0; i < size; i += 1) {
      if (Object.values(this.keys)[i] === keys && !this.asyncKeys[i]) {
        this.asyncKeys[i] = keys;

        break;
      }
    }
  }

  keyReleased = (e) => {
    const keys = e.keyCode;
    const size = Object.keys(this.keys).length;

    for (let i = 0; i < size; i += 1) {
      if (Object.values(this.keys)[i] === keys && this.asyncKeys[i]) {
        this.asyncKeys[i] = false;
        break;
      }
    }
  }

  loadMap = async (mapUri) => {
    await fetch(mapUri).then(res => res.json()).then(resJson => this.setState({
      map: [...resJson],
    }));
    this.loaded = true;
    this.pokemon1 = new Pokemon(55, 'greug', 16, 20, this.state.map);
    const {
      viewY, viewX, viewWidth, viewHeight, map,
    } = this.state;
    this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight);
  };

  loadTiles = (tilesKeys) => {
    const tiles = tilesKeys.sort((a, b) => a.split('-')[0].substring(2, a.split('-')[0].lenght) - b.split('-')[0].substring(2, b.split('-')[0].lenght));


    const style = document.createElement('style');
    style.type = 'text/css';
    let css = '';
    for (let i = 0; i < tiles.length; i += 1) {
      const fileZIndex = tiles[i].split('-')[2].split('.').slice()[0];

      css += `.tile-${i} {background-image: url(${reqTiles(tiles[i], true)});\n z-index: ${parseInt(fileZIndex.substring(1, fileZIndex.length))}}\n`;
    }
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  updateViewMap = (matrix, offsetX, offsetY, width, height) => {
    if (offsetX + width > matrix[0].length) return;
    if (offsetY + height > matrix.length) return;
    const subMatrix = [];
    for (let i = offsetY; i < height + offsetY; i += 1) {
      const index = subMatrix.push(matrix[i]) - 1;
      subMatrix[index] = subMatrix[index].slice(offsetX, offsetX + width);
    }
    this.setState({ view: [...subMatrix] });
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
    const { view } = this.state;
    return (
      <div style={this.theme}>
        {this.debugMode ? this.debug() : null}
        {this.loaded ? view.map((row, i) => (
          <MapRow data={row} index={i} key={`row-${i + 1}`} />
        )) : <h1 style={{ margin: '50% auto' }}>LOADING..</h1>}
        <Player />
      </div>
    );
  }
}

export default Map;
