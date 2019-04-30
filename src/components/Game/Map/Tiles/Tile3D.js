import React from 'react';
import './Tiles.css';

const Tile3D = (props) => {
  const { data, position } = props;
  return (
    <div className="tile3DContainer">
      {data.map((tile, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={`tile3D tile-${tile === -1 ? 'collide' : tile} ${tile} ${position}`} key={index} />
      ))}
    </div>
  );
};

export default Tile3D;
