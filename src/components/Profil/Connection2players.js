import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import PremierPokemon from './PremierPokemon';
import Trainer from './Trainer';
import UserName from './UserName';
import RecognitionPlayer2 from './RecognitionPlayer2';
import '../../App.css';


class Connection2Players extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      profil2: {},
    };
  }

  saveInputs = (input) => {
    let { profil2 } = this.state;
    const { history } = this.props;
    if (input.type === 'testSubmit') {
      this.setState({
        step: 2,
        profil2: { ...profil2, name: input.value },
      });
    }
    if (input.type === 'usernameSubmit') {
      this.setState({
        profil2: { ...profil2, name: input.value },
        step: 3,
      });
    }
    if (input.type === 'trainerSubmit') {
      this.setState({
        profil2: { ...profil2, trainer: [input.value] },
        step: 4,
      });
    }
    if (input.type === 'pokemonSubmit') {
      profil2 = { ...profil2, pokemon: [input.value] };
      this.setState({
        profil2,
      }, () => {
        localStorage.setItem(profil2.name, JSON.stringify(profil2));
        localStorage.setItem('userActive1', profil2.name);
        history.push('/playvs');
      });
    }
  }

  displayStep = () => {
    const { step, profil2, name } = this.state;
    switch (step) {
      case 1:
        return <RecognitionPlayer2 sendInput={this.saveInputs} />;
      case 2:
        return <UserName name={name} sendInput={this.saveInputs} />;
      case 3:
        return <Trainer name={profil2.name} sendInput={this.saveInputs} />;
      case 4:
        return <PremierPokemon name={profil2.name} sendInput={this.saveInputs} />;
      default:
        return <RecognitionPlayer2 sendInput={this.saveInputs} />;
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
        <div>
          {this.displayStep()}
        </div>
      </div>
    );
  }
}

export default Connection2Players;
