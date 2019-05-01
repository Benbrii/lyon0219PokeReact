import React from 'react';
import './PokeCell.css';
import sprites from './BBimg/sprites.png';

const PokeCell = ({ pokeClass, handleOnClick, captured }) => {
  const { id, backgroundPosition } = pokeClass;
  const style = {
    backgroundImage: `url(${sprites})`,
    backgroundPosition,
    filter: `grayscale(${captured ? '0' : '1'})`,
  };

  return <button type="button" onClick={() => handleOnClick(id)} style={style} className="poke-cell" />;
};

export default PokeCell;
