import React from 'react';
import './Tiles.css';
import { SPRITE_SIZE, TILE_WIDTH } from '../../constants'

const Tile3D = (props) => {
  const { data, position } = props;
  let size = 64;
  if (window.innerWidth < 950) {
    size = Math.floor((window.innerWidth - 10) / TILE_WIDTH)
  }
  const theme = {
    width: `${props.viewportConfig.tileSize}px`,
    height: `${props.viewportConfig.tileSize}px`,
  }
  return (
    <div className="tile3DContainer" style={theme}>
      {data.map((tile, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={`tile3D tile-${tile === -1 ? 'collide' : tile} ${position}`} key={index} style={theme}/>
      ))}
    </div>
  );
};

export default Tile3D;
