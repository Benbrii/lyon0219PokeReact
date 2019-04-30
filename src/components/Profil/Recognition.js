import React, { Component } from 'react';
import '../../App.css';
import { withRouter } from 'react-router-dom';


class Recognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  handleSubmit = () => {
    const {
      sendInput, history,
    } = this.props;
    const { name } = this.state;
    if (localStorage.getItem(name)) {
      localStorage.setItem('userActive0', name);
      history.push({
        pathname: '/menu',
        state: { user: name },
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
    return (
      <div className="Flex">
        <p>
          Hi there!
          <br />
          What’s your trainer name?
        </p>
        <input className="Input" id="name" type="text" placeholder="Your name" onChange={this.handleChange} />
        <button className="Button" id="submitBtn" type="button" onClick={this.handleSubmit}>Go !</button>
      </div>
    );
  }
}
export default withRouter(Recognition);
