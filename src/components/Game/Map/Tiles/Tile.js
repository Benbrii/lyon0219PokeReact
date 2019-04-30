import React from 'react';
import './Tiles.css';

const Tile = (props) => {
  const { data, position } = props;
  return <div className={`tile tile-${data} ${data} ${position}`} />;
};

export default Tile;
