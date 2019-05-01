import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';
import logo from '../../images/Logo.png';


const Home = () => (
  <div className="Home">
    <img className="Logo" src={logo} alt="PokeReact logo" />
    <NavLink to="/creation">
      <button className="FirstButton" type="button"> Play now ! </button>
    </NavLink>
  </div>
);

export default Home;
