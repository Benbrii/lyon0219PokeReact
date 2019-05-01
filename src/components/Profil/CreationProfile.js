import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UserName from './UserName';
import PremierPokemon from './PremierPokemon';
import Trainer from './Trainer';
import '../../App.css';
import Recognition from './Recognition';


class CreationProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      profil: {},
    };
  }

  saveInputs = (input) => {
    let { profil } = this.state;
    const { history } = this.props;
    if (input.type === 'testSubmit') {
      this.setState({
        step: 2,
        profil: { ...profil, name: input.value },
      });
    }
    if (input.type === 'usernameSubmit') {
      this.setState({
        profil: { ...profil, name: input.value },
        step: 3,
      });
    }
    if (input.type === 'trainerSubmit') {
      this.setState({
        profil: { ...profil, trainer: [input.value] },
        step: 4,
      });
    }
    if (input.type === 'pokemonSubmit') {
      profil = { ...profil, pokemon: [input.value] };
      this.setState({
        profil,
      }, () => {
        localStorage.setItem(profil.name, JSON.stringify(profil));
        localStorage.setItem('userActive0', profil.name);
        history.push('/menu');
      });
    }
  }

  displayStep = () => {
    const { step, profil, name } = this.state;
    switch (step) {
      case 1:
        return <Recognition sendInput={this.saveInputs} />;
      case 2:
        return <UserName name={name} sendInput={this.saveInputs} />;
      case 3:
        return <Trainer name={profil.name} sendInput={this.saveInputs} />;
      case 4:
        return <PremierPokemon name={profil.name} sendInput={this.saveInputs} />;
      default:
        return <Recognition sendInput={this.saveInputs} />;
    }
  }

  render() {
    return (
      <div className="Background">
        <div className="LeftMenu">
          <NavLink to="/menu">
            <button type="button" className="RoundBtn">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </NavLink>
        </div>
        {this.displayStep()}
      </div>
    );
  }
}

export default CreationProfile;
