import React from 'react';
import './Capture.css';
import { NavLink } from 'react-router-dom';
import '../../App.css';

export default class Capture extends React.Component {
  constructor(props) {
    super(props);
    this.userName = '';
    this.pokemon = [];
    this.state = {
      x: -1000,
    };
    this.theme = {
      position: 'fixed',
      top: '20%',
      zIndex: '100',
      display: 'block',
      backgroundColor: 'rgb(44, 88, 177)',
      border: '10px solid black',
      transition: 'all 750ms',
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ x: 0 }, () => setTimeout(() => this.setState({ x: -1000 }), 4000));
    }, 500);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      setTimeout(() => {
        this.setState({ x: 0 }, () => setTimeout(() => this.setState({ x: -1000 }), 4000));
      }, 500);
    }
  }


  render() {
    const { pokemon, player, name } = this.props;
    const { x } = this.state;
    const pos = {};
    if (player === 1) {
      pos.right = `${x}px`;
    } else {
      pos.left = `${x}px`;
    }


    return (

      <div
        className="alert"
        style={{ ...this.theme, ...pos }}
      >

        <div className="footer">
          <h1 className="textModal">{`${name} catched ${pokemon}`}</h1>
          <NavLink to={`/pokedex${player > 0 ? ':player2' : ''}`}>
            <button type="button" className="Button"> Go to Pokedex </button>
          </NavLink>

        </div>
      </div>
    );
  }
}
