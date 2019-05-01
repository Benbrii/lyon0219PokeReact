/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import '../../App.css';
import Percila from '../../assets/characters/character_1__Percila.png';
import Kunz from '../../assets/characters/character_2__Kunz.png';
import Iris from '../../assets/characters/character_3__Iris.png';
import Matis from '../../assets/characters/character_4__Matis.png';
import Bardane from '../../assets/characters/character_5__Bardane.png';
import Inezia from '../../assets/characters/character_6__Inezia.png';
import Artie from '../../assets/characters/character_7__Artie.png';
import Strykna from '../../assets/characters/character_8__Strykna.png';
import Tcheren from '../../assets/characters/character_9__Tcheren.png';
import Carolina from '../../assets/characters/character_10__Carolina.png';
import Amana from '../../assets/characters/character_11__Amana.png';
import Watson from '../../assets/characters/character_12__Watson.png';

class Trainer extends Component {
  handleChange = (event) => {
    const { sendInput } = this.props;
    const input = {};
    input.type = 'trainerSubmit';
    input.value = event.target.id;
    sendInput(input);
  }

  render() {
    return (
      <div className="ChooseTrainer">
        <p>
          Choose your trainer style!
        </p>
        <div>
          <img className="ChooseBtn" id="1" src={Percila} alt="Percila" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="2" src={Kunz} alt="Kunz" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="3" src={Iris} alt="Iris" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="4" src={Matis} alt="Matis" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="5" src={Bardane} alt="Bardane" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="6" src={Inezia} alt="Inezia" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="7" src={Artie} alt="Artie" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="8" src={Strykna} alt="Strykna" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="9" src={Tcheren} alt="Tcheren" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="10" src={Carolina} alt="Carolina" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="11" src={Amana} alt="Amana" type="button" onClick={this.handleChange} />
          <img className="ChooseBtn" id="12" src={Watson} alt="Watson" type="button" onClick={this.handleChange} />
        </div>
      </div>
    );
  }
}
export default Trainer;
