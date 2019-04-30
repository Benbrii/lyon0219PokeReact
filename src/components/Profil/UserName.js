import React, { Component } from 'react';
import '../../App.css';

class UserName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erreur: false,
      name: '',
    };
  }

handleChange = (event) => {
  this.setState({
    name: event.target.value,
  });
}

handleSubmit = () => {
  const { sendInput } = this.props;
  const { name } = this.state;
  if (parseInt(name, 10) || name.length < 2 || localStorage.getItem('userActive0') === name || localStorage.getItem('userActive1') === name) {
    this.setState({ erreur: name });
  } else {
    const input = {};
    input.type = 'usernameSubmit';
    input.value = name;
    sendInput(input);
  }
}

render() {
  const { erreur } = this.state;
  return (
    <div className="Flex">
      <p>
        It’s seems you don’t have any profile yet!
        <br />
        Please create one
      </p>
      {erreur ? (
        <p>
Your name can’t be
          {' '}
          {erreur}
        </p>
      ) : ''}
      <br />
      <input className="Input" id="name" type="text" placeholder="Your name" onChange={this.handleChange} />
      <button className="Button" id="submitBtn" type="button" onClick={this.handleSubmit}>Create</button>
    </div>
  );
}
}


export default UserName;
