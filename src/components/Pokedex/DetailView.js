import React from 'react';
import './DetailView.css';

const DetailView = ({ pokemon }) => {
  const {
    id, name, sprite, type,
  } = pokemon;

  return (
    <section className="detail-view">
      <h1 className="data-name">{name}</h1>
      <img src={sprite} className="sprite-image" alt="" />
      <div className="data-wrapper">
        <h1 className="data-name">
Pokemon #
          {id}
          {' '}
          {name}
        </h1>
        <p className="data-char">
Type:
          {' '}
          {type}
        </p>
      </div>
    </section>
  );
};

export default DetailView;
