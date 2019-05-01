import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/Logo.png';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="Background">

        <img src={logo} className="MenuLogo" alt="PokeReact logo" />

        <div className="RightMenu">
          <NavLink to="/profil">
            <button type="button" className="RoundBtn">
              <FontAwesomeIcon icon={faUser} />
            </button>
          </NavLink>
          <NavLink to="/commands">
            <button type="button" className="RoundBtn"> ? </button>
          </NavLink>
        </div>

        <NavLink to="/play">
          <button type="button" className="Button"> Catch ‘em all! </button>
        </NavLink>
        <NavLink to="/connection2players">
          <button type="button" className="Button"> Versus </button>
        </NavLink>
        <NavLink to="/pokedex">
          <button type="button" className="Button"> Pokedex </button>
        </NavLink>
      </div>
    );
  }
}

export default Menu;
