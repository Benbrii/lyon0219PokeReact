import React from 'react';
import './Tiles.css';

const Tile3D = (props) => {
  const { data } = props;
  return (
    <div className="tile3DContainer">
      {data.map((tile, index) => (
        <div className={`tile3D tile-${tile === -1 ? 'collide' : tile}`} key={`${tile}-${index + 1}`} />
      ))}
    </div>
  );
};

export default Tile3D;
