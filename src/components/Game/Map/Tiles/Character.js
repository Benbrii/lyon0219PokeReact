import React from 'react';
import front from '../../../../images/sacha/front.png';

const Character = () => (
  <div style={{
    backgroundImage: `url(${front})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '32px',
    height: '32px',
    position: 'absolute',
    justifyContent: 'center',
    top: '42%',
    left: '49%',
  }}
  />

);

export default Character;
