import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import up from '../../images/up.png';
import right from '../../images/right.png';
import left from '../../images/left.png';
import down from '../../images/down.png';


const Commands = () => (
  <div className="Background">

    <div className="LeftMenu">
      <NavLink to="/menu">
        <button type="button" className="RoundBtn">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </NavLink>
    </div>

    <div className="RightMenu">
      <NavLink to="/profil">
        <button type="button" className="RoundBtn">
          <FontAwesomeIcon icon={faUser} />
        </button>
      </NavLink>
    </div>

    <div className="Commands">
      <div>
        <img src={up} className="CommandsImg" alt="PokeReact up" />
        <p>Up</p>
      </div>
      <div>
        <img src={right} className="CommandsImg" alt="PokeReact right" />
        <p>Right</p>
      </div>
      <div>
        <img src={left} className="CommandsImg" alt="PokeReact left" />
        <p>Left</p>
      </div>
      <div>
        <img src={down} className="CommandsImg" alt="PokeReact down" />
        <p>Down</p>
      </div>
      <div>
        <button type="button" className="AnimatedRoundBtn"> C </button>
        <p>Capture</p>
      </div>
    </div>
  </div>
);

export default Commands;
