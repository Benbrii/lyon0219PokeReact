import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/Logo.png';


const Menu = () => (


  <div className="Background">

    <div className="LeftMenu">
      <NavLink to="/play">
        <button type="button" className="RoundBtn">
          <FontAwesomeIcon icon={faUser} />
        </button>
      </NavLink>
    </div>

    <img src={logo} className="MenuLogo" alt="PokeReact logo" />

    <div className="RightMenu">
      <NavLink to="/commands">
        <button type="button" className="RoundBtn"> ? </button>
      </NavLink>
    </div>

    <NavLink to="/play">
      <button type="button" className="Button"> Catch ‘em all! </button>
    </NavLink>
    <NavLink to="/playvs">
      <button type="button" className="Button"> Versus </button>
    </NavLink>
    <NavLink to="/pokedex">
      <button type="button" className="Button"> Pokedex </button>
    </NavLink>
    <NavLink to="/creation">
      <button type="button" className="Button"> creationProfile </button>
    </NavLink>
  </div>
);

export default Menu;
