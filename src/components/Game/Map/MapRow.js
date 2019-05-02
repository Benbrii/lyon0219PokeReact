/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import Tile from './Tiles/Tile';
import Tile3D from './Tiles/Tile3D';

class MapRow extends Component {
    theme = {
      height: '7.69vw',
      maxHeight: '7.69vh',
      margin: 0,
      padding: 0,
    }

    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
      const { data, index } = this.props;

      const tilesSet = data.map((tiles, i) => {
        if (tiles.length > 1 && tiles.includes('-1')) {
          return <Tile data={tiles} key={`tile-${i}-${index}`} position={`tile-${i}-${index}`} />;
        } if (tiles.length > 1) {
          return <Tile3D data={tiles} key={`tile-${i}-${index}`} position={`tile-${i}-${index}`} />;
        }

        return <Tile data={tiles} key={`tile-${i}-${index}`} position={`tile-${i}-${index}`} />;
      });
      return (
        <div className={`row row-${index}`} style={this.theme}>
          {tilesSet}
        </div>
      );
    }
}

export default MapRow;
