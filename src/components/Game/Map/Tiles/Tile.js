import React from 'react';
import './Tiles.css';

const Tile = (props) => {
  const { data } = props;
  return <div className={`tile tile-${data}`} key={`${data}-${data + 1}`} />;
};

export default Tile;
