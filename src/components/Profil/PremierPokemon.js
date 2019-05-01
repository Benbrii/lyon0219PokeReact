/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import '../../App.css';
import Pikachu from '../../images/Pikachu.png';
import Bulbizarre from '../../images/Bulbizarre.png';
import Salameche from '../../images/Salameche.png';
import Carapuce from '../../images/Carapuce.png';


class PremierPokemon extends Component {
  handleChange = (event) => {
    const { sendInput } = this.props;
    const input = {};
    input.type = 'pokemonSubmit';
    input.value = event.target.id;
    sendInput(input);
  }

  render() {
    const { name } = this.props;
    return (
      <div className="Flex">
        <p>
          <span className="Yellow">
          It is dangerous to go alone
          </span>
          {' '}
          {`${name}`}
          .
          <br />
          Take a Pokemon whith you!
        </p>
        <div>
          <img className="ChooseBtn" id="25" src={Pikachu} alt="Pikachu" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="1" src={Bulbizarre} alt="Bulbizarre" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="4" src={Salameche} alt="Salamèche" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="7" src={Carapuce} alt="Carapuce" type="button" onClick={this.handleChange} />
        </div>
      </div>
    );
  }
}
export default PremierPokemon;
