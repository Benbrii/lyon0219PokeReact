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
      border: '4px solid black',
      margin: '0 auto',
      textAlign: 'center',
    };

    this.loaded = false;
    this.asyncKeys = [];
    this.debugMode = true;
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
    const { map, viewWidth, viewHeight } = this.state;
    let { viewY, viewX } = this.state;
    const { view } = this.state;

    const step = 1;
    let change;
    for (let i = 0; i < Object.keys(this.keys).length; i += 1) {
      if (Object.values(this.keys)[i] === this.asyncKeys[i]) {
        change = true;
        if (this.asyncKeys[i] === 38
             && !view[Math.floor(view.length / 2 - step)][Math.floor(view.length / 2)]
               .includes(-1)) {
          viewY -= step;
          break;
        }
        if (this.asyncKeys[i] === 40
            && !view[Math.floor(view.length / 2 + step)][Math.floor(view.length / 2)]
              .includes(-1)) {
          viewY += step;
          break;
        }
        if (this.asyncKeys[i] === 37
            && !view[Math.floor(view.length / 2)][Math.floor(view.length / 2 - step)]
              .includes(-1)) {
          viewX -= step;
          break;
        }
        if (this.asyncKeys[i] === 39
             && !view[Math.floor(view.length / 2)][Math.floor(view.length / 2 + step)]
               .includes(-1)) {
          viewX += step;
          break;
        }
      }
    }
    if (!change) return;
    this.setState({
      viewY,
      viewX,
    },
    () => this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight));
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

  debug = () => {
    if (!this.debugMode) return;
    this.renderCounter += 1;
    // eslint-disable-next-line consistent-return
    return <h3 style={{ position: 'fixed', bottom: 10, right: 10 }}>{`Render No ${this.renderCounter} Loop No ${this.loopCounter}`}</h3>;
  }

  render() {
    const { view } = this.state;
    return (
      <div style={this.theme}>
        {this.debugMode ? this.debug() : null}
        {this.loaded ? view.map((row, i) => (
          <MapRow data={row} index={i} key={`row-${i + 1}`} />
        )) : <h1 style={{ margin: '50% auto' }}>LOADING..</h1>}
        <Character />
      </div>
    );
  }
}

export default Map;
