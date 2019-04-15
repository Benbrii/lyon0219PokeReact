import React, { Component } from 'react';
import MapRow from './MapRow';
import Character from './Tiles/Character';

const reqMaps = require.context('../../../assets/maps', true, /\.txt$/);
const reqTiles = require.context('../../../assets/tiles', true, /\.png$/);

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: [],
      view: [],
      viewWidth: 15,
      viewHeight: 15,
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
      transform: 'translate(-50%, -50%)',
      width: '960px',
      height: '960px',
      //overflow: 'hidden',
      border: '4px solid black',
      margin: '0 auto',
      textAlign: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transition : 'all 500ms',
    };
    this.left = 50;

    this.loaded = false;
    this.asyncKeys = [];
    this.debugMode = true;
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
    await this.loadMap(reqMaps('./001-3d-collide.txt', true));
    await this.loadTiles(reqTiles.keys());
    for (let i = 0; i < Object.keys(this.keys).length; i += 1) {
      this.asyncKeys.push(false);
    }
    document.body.addEventListener('keydown', this.keyPressed);
    document.body.addEventListener('keyup', this.keyReleased);
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
    this.checkKeyboard();
  }

  checkKeyboard = () => {
    const step = 1;
    for (let i = 0; i < Object.keys(this.keys).length; i += 1) {
      if (Object.values(this.keys)[i] === this.asyncKeys[i]) {

        if (this.asyncKeys[i] === 38){
          this.moveTo('up', step)
          break;
        }
        if (this.asyncKeys[i] === 40){
          this.moveTo('down', step)
          break;
        }
        if (this.asyncKeys[i] === 37){
          this.moveTo('left', step)
          break;
        }
        if (this.asyncKeys[i] === 39){
          this.moveTo('right', step)
          break;
        }
      }
    }
  }

  moveTo = (direction, step) => {
    if (performance.now() - this.lastScroll < 1000 / this.scrollSpeed) return
    const { map, view, viewWidth, viewHeight } = this.state;
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
          this.left += 5
          console.log(this.left)
        }
        break;

      case 'right':
        if (!view[Math.floor(view.length / 2)][Math.floor(view.length / 2 + step)]
          .includes(-1)) {
          viewX += step;
          this.left -= 5
          console.log(this.left)
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
        this.clean();
        this.lastScroll = performance.now()
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
      css += `.tile-${i} {background-image: url(${reqTiles(tiles[i], true)})}\n`;
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

  clean = () => {

  }

  debug = () => {
    if (!this.debugMode) return;
    this.renderCounter += 1;
    // eslint-disable-next-line consistent-return
    return <h3 style={{ position: 'fixed', bottom: 10, right: 10 }}>{`Render No ${this.renderCounter} Loop No ${this.loopCounter}`}</h3>;
  }

  render() {
    const { view } = this.state;
    return (
      <div style={{...this.theme, left: `${this.left}%`}}>
        {this.debugMode ? this.debug() : null}
        {this.loaded ? view.map((row, i) => (
          <MapRow data={row} index={i} key={`row-${i + 1}`} />
        )) : <h1 style={{ margin: '50% auto' }}>LOADING..</h1>}
        
      </div>
    );
  }
}

export default Map;
