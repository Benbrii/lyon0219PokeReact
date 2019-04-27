import React, { Component } from 'react';
import './Character.css';

const Player = (props) => {
  const { viewportConfig, direction } = props;
  //console.log(JSON.stringify(viewportConfig.tileSize))
  // if (props.viewportConfig.tileSize){}
  // const theme = {
  //   width: `${viewportConfig.tileSize}px`,
  //   height: `${viewportConfig.tileSize}px`,
  // }

  return <div className={direction} />
};

export default Player;


