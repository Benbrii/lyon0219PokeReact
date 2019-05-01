import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import '../../App.css';


class Recognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      erreur: false,
    };
  }

  handleSubmit = () => {
    const {
      sendInput, history,
    } = this.props;
    const { name } = this.state;
    if (localStorage.getItem('userActive0') === name) {
      this.setState({ erreur: name });
    } else if (localStorage.getItem(name)) {
      localStorage.setItem('userActive1', name);
      history.push({
        pathname: '/playvs',
      });
    } else {
      const input = {};
      input.type = 'testSubmit';
      input.value = name;
      sendInput(input);
    }
  }

  handleChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  }

  render() {
    const { erreur } = this.state;
    const profil = localStorage.getItem('userActive0');
    return (
      <div className="Flex">
        <p>
          <span className="Yellow">Player 1:</span>
          <br />
          {' '}
          {profil}
        </p>
        <div className="changeProfil">
          <NavLink to="./creation" className="Yellow">
            {' '}
            Use another profil.
          </NavLink>
        </div>
        <p>
          <br />
          <span className="Yellow">Player 2:</span>
          <br />
          What’s your trainer name ?
        </p>
        {erreur ? (
          <p>
            <span className="Error">
This name is not available,
              <br />
            Please, choose another one!
            </span>
          </p>

        ) : ''}
        <input className="Input" id="name" type="text" placeholder="Your name" onChange={this.handleChange} />
        <button className="Button" id="submitBtn" type="button" onClick={this.handleSubmit}>Go !</button>
      </div>
    );
  }
}
export default withRouter(Recognition);
