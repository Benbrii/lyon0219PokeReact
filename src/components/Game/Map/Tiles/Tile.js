import React from 'react';
import './Tiles.css';
import { SPRITE_SIZE, TILE_WIDTH } from '../../constants'

const Tile = (props) => {
  const { data, position } = props;
  let size = 64;
  if (window.innerWidth < 950) {
    size = Math.floor((window.innerWidth - 10) / TILE_WIDTH)
  }

  const theme = {
    width: `${props.viewportConfig.tileSize}px`,
    height: `${props.viewportConfig.tileSize}px`,
  }
  return <div className={`tile tile-${data} ${position}`} style={theme} />;
};

export default Tile;
