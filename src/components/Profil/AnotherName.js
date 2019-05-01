import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/Logo.png';


class AnotherName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  handleSubmit = () => {
    const { history } = this.props;
    const { name } = this.state;
    if (localStorage.getItem('userActive0') !== name) {
      history.push({ pathname: '/connection2Players' });
    }
  }

  handleChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  }

  render() {
    return (
      <div className="Background">

        <img src={logo} className="MenuLogo" alt="PokeReact logo" />
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
          <NavLink to="/commands">
            <button type="button" className="RoundBtn"> ? </button>
          </NavLink>
        </div>

        <div className="Flex">
          <p>
          Your name is not avaible,
            {' '}
            please choose another one !
            <br />
          </p>
          <button className="Button" id="submitBtn" type="button" onClick={this.handleSubmit}>Return</button>
        </div>
      </div>
    );
  }
}
export default AnotherName;
