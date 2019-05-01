import React from 'react';
import './Numinput.css';

class NumInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    const { id } = this.state;
    this.props.displayPokemon(id);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ id: e.target.value });
  }

  render() {
    const { no } = this.props;
    return (
      <div className="allInput">
        <input
          type="number"
          className="screen num-input"
          placeholder={no}
          onChange={this.handleChange}
        />
        <button className="submit" onClick={this.handleClick} type="button" />
      </div>
    );
  }
}

export default NumInput;
