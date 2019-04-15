import React from 'react';
import front from '../../../../images/sacha/front.png';

const Character = () => (
  <div className='character' style={{
    transform: 'translate(-50%, -50%)',
    backgroundImage: `url(${front})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '704px',
    height: '704px',
    position: 'absolute',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    margin: '0 auto',
    border: '13px solid white',
  }}
  />

);

export default Character;
