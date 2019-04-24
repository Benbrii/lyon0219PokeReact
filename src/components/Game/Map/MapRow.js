import React, { Component } from 'react';
import Tile from './Tiles/Tile';
import Tile3D from './Tiles/Tile3D';

class MapRow extends Component {
    theme = {
      height: '64px',
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
          return <Tile data={tiles} key={`tile-${i + 1}`} index={i} />;
        } if (tiles.length > 1) {
          return <Tile3D data={tiles} key={`tile-${i + 1}`} index={i} />;
        }

        return <Tile data={tiles} key={`tile-${i + 1}`} index={i} />;
      });
      return (
        <div className={`row row-${index}`} style={this.theme}>
          {tilesSet}
        </div>
      );
    }
}

export default MapRow;
