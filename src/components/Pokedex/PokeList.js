import React from 'react';
import './PokeList.css';
import PokeCell from './PokeCell';
import pokeClasses from './PokeClasses';

const PokeList = ({ handleOnClick, capturedpokemons }) => {
  const cells = pokeClasses.map(pokeClass => (
    <PokeCell
      key={pokeClass.id}
      pokeClass={pokeClass}
      handleOnClick={handleOnClick}
      captured={capturedpokemons.includes(pokeClass.id)}
    />
  ));

  return (
    <section className="poke-list">
      {cells}
    </section>
  );
};

export default PokeList;
