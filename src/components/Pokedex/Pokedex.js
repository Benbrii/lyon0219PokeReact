import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Pokedex.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import PokeList from './PokeList';
import DetailView from './DetailView';
import Pokemon from './Pokemon';
import Divider from './Divider';
import DividerButton from './DividerButton';
import Capture from './Capture';

class Pokedex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemon: {},
      pokemonid: 1,
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentWillMount() {
    const { pokemonid } = this.state;
    this.fetchApi(pokemonid);
  }

  fetchApi = (id) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
      .then(res => res.json())
      .then((data) => {
        const pokemon = new Pokemon(data);
        this.setState({ pokemon });
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log(err));
  }

  handleOnClick(id) {
    this.setState({
      pokemonid: id / 1,
    }, () => this.fetchApi(id));
  }

  previousPokemon() {
    let { pokemonid } = this.state;
    if (pokemonid > 1) {
      pokemonid -= 1;
    } else {
      pokemonid = 1;
    }
    this.setState({
      pokemonid,
    }, () => this.fetchApi(pokemonid));
  }

  nextPokemon() {
    let { pokemonid } = this.state;
    if (pokemonid < 151) {
      pokemonid += 1;
    } else {
      pokemonid = 1;
    }
    this.setState({
      pokemonid,
    }, () => this.fetchApi(pokemonid));
  }

  render() {
    const { pokemon } = this.state;
    return (
      <div className="Background">

        <Capture />
        <div className="LeftMenu">
          <NavLink to="/profil">
            <button type="button" className="RoundBtn">
              <FontAwesomeIcon icon={faUser} />
            </button>
          </NavLink>
        </div>

        <div className="RightMenu">
          <NavLink to="/menu">
            <button type="button" className="RoundBtn">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </NavLink>
        </div>

        <div className="Pokedex">
          <PokeList handleOnClick={this.handleOnClick} />
          <Divider />
          <DetailView pokemon={pokemon} getNewState={this.newPokemon} />
        </div>

        <div className="Buttons">
          <button type="button" className="pokedexbuttons" onClick={() => this.previousPokemon()} />
          <h5 className="nextandpreviousbuttons">Previous Pokemon</h5>
          <DividerButton />
          <h5 className="nextandpreviousbuttons">Next Pokemon</h5>
          <button type="button" className="pokedexbuttons" onClick={() => this.nextPokemon()} />
        </div>
      </div>
    );
  }
}

export default Pokedex;
