import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import './Pokedex.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import PokeList from './PokeList';
import DetailView from './DetailView';
import Pokemon from './Pokemon';
import Divider from './Divider';
import NumInput from './Numinput';


class Pokedex extends Component {
  constructor(props) {
    super(props);
    this.userName = '';
    this.pokemon = [];
    this.state = {
      pokemon: {},
      pokemonid: 1,
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentWillMount() {
    const { pokemonid } = this.state;
    const { history } = this.props;
    if (!localStorage.getItem(this.props.match.params.player ? "userActive1" : "userActive0")) {
      history.push('/');
      return;
    }
    this.fetchApi(pokemonid);
    this.checkCapturedPokemon();
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

  checkCapturedPokemon = () => {
    this.userName = localStorage.getItem(this.props.match.params.player ? "userActive1" : "userActive0");
    this.pokemon = JSON.parse(localStorage.getItem(this.userName)).pokemon;
  }


  reloadingPage = () => {
    window.location.reload();
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
        <p>
          {this.userName}
          ’s Pokedex
        </p>
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

        <div className="Pokedex">
          <PokeList handleOnClick={this.handleOnClick} capturedpokemons={this.pokemon || []} />
          <Divider />
          <DetailView pokemon={pokemon} getNewState={this.newPokemon} />
        </div>

        <div className="Buttons">
          <button type="button" className="pokedexbuttons" onClick={() => this.previousPokemon()} />
          <NumInput displayPokemon={this.handleOnClick} />
          <button type="button" className="pokedexbuttons" onClick={() => this.nextPokemon()} />
        </div>
      </div>
    );
  }
}

export default withRouter(Pokedex);
