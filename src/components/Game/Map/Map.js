import React, { Component } from 'react';
import MapRow from './MapRow';
import Player from './Tiles/Character';
import { ableToMove } from '../utils';
import Capture from '../../Pokedex/Capture';
import { Pokemon } from '../character';
import { Bonus } from '../Bonus';

const reqMaps = require.context('../../../assets/maps', true, /\.txt$/);

const MemorizedAlert = React.memo(Capture);
const MemorizedRow = React.memo(MapRow);

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: [],
      view: [],
      viewWidth: 13,
      viewHeight: 13,
      viewX: 11,
      viewY: 17,
      characterDirection: 'character',
      pokemons: [],
      payerGhosts: [],
      visiblePokemons: [],
      bonus: [],
      bonusMap: [],
      visibleBonus: [],
    };

    this.theme = {
      width: '832px',
      height: '832px',
      overflow: 'hidden',
      border: '4px solid black',
      margin: '0 auto',
      textAlign: 'center',
    };

    this.loaded = 0;
    this.asyncKeys = [];
    this.debugMode = false;
    this.gamepads = [];
    this.scrollSpeed = 8;
    this.lastScroll = 0;
    this.catchBonus = 0;
    if (this.debugMode) {
      this.renderCounter = 0;
      this.loopCounter = 0;
    }
  }

  componentWillMount() {
    this.init();
  }

  componentWillUnmount() {
    this.end();
  }

  init = async () => {
    this.configInstance();
    await this.loadMap(reqMaps('./map1.txt', true));
    // eslint-disable-next-line no-return-assign
    fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151')
      .then(res => res.json())
      .then(resJson => (this.pokeBase = resJson.results))
      .then(() => (this.loaded += 1));
    // eslint-disable-next-line no-nested-ternary
    this.gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads
        : [];
    this.running = setInterval(this.run, 1000 / 30);
  };

  end = () => {
    clearInterval(this.running);
    this.asyncKeys = null;
    this.running = null;
    this.renderCounter = null;
    this.loaded = null;
  };

  configInstance = () => {
    this.config = {};
    const { controller, players } = this.props;
    let { characterDirection } = this.state;
    this.gamepad = controller;
    if (controller === 0) {
      this.config.host = true;
    }
    if (players > 1) this.config.multiplayerMode = true;

    this.userProfile = {};
    this.user = localStorage.getItem(`userActive${controller}`);
    this.userProfile = JSON.parse(localStorage.getItem(this.user));
    characterDirection = `character_${this.userProfile.trainer[0]}_down0`;
    this.userProfile.direction = characterDirection;
    this.setState({ characterDirection }, () => (this.loaded += 1));
  };

  loadMap = async (mapUri) => {
    await fetch(mapUri)
      .then(res => res.json())
      .then(resJson => this.setState({
        map: [...resJson],
      }));
    this.loaded += 1;

    // Will move //

    const {
      viewY, viewX, viewWidth, viewHeight, map,
    } = this.state;

    this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight);
  };

  checkGamepad = (gamepadId) => {
    // eslint-disable-next-line no-nested-ternary
    this.gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads
        : [];
    if (!this.gamepads[gamepadId]) {
      return;
    }
    const step = 1;

    const gp = this.gamepads[gamepadId];
    if (gp.buttons[12].pressed) {
      this.moveTo('up', step);
    } else if (gp.buttons[13].pressed) {
      this.moveTo('down', step);
    } else if (gp.buttons[14].pressed) {
      this.moveTo('left', step);
    } else if (gp.buttons[15].pressed) {
      this.moveTo('right', step);
    } else if (gp.axes[0] === 1) {
      this.moveTo('right', step);
    } else if (gp.axes[0] === -1) {
      this.moveTo('left', step);
    } else if (gp.axes[1] === 1) {
      this.moveTo('down', step);
    } else if (gp.axes[1] === -1) {
      this.moveTo('up', step);
    }
  };

  checkKeyboard = () => {
    let step = 1;
    const { pokemons, viewX, viewY } = this.props;
    const { controls, asyncKeys } = this.props;
    for (let i = 0; i < controls.length; i += 1) {
      if (controls[i] === asyncKeys[i]) {
        if (asyncKeys[i] === controls[0]) {
          this.moveTo('up', step);
          break;
        }
        if (asyncKeys[i] === controls[1]) {
          this.moveTo('down', step);
          break;
        }
        if (asyncKeys[i] === controls[2]) {
          this.moveTo('left', step);
          break;
        }
        if (asyncKeys[i] === controls[3]) {
          this.moveTo('right', step);
          break;
        }
        if (this.asyncKeys[i] === null) {
          step = 0;
          this.moveTo('stay', step);
          break;
        }
        if (asyncKeys[i] === controls[5]) {
          if (this.config.host) {
            pokemons[0].goto(
              viewX + 6,
              viewY + 6,
              true,
            );
          }
          break;
        }
      }
    }
  };

  moveTo = (direction, step) => {
    if (performance.now() - this.lastScroll < 1000 / this.scrollSpeed) return;

    const {
      map, viewWidth, viewHeight, pokemons,
    } = this.state;
    let {
      viewY, viewX, characterDirection,
    } = this.state;

    if (!ableToMove({ x: viewX + 6, y: viewY + 6 }, direction, step, map)) { return; }
    switch (direction) {
      case 'up':
        viewY -= step;
        characterDirection = `character_${this.userProfile.trainer[0]}_up0`;
        break;

      case 'down':
        viewY += step;
        characterDirection = `character_${this.userProfile.trainer[0]}_down0`;
        break;

      case 'left':
        viewX -= step;
        characterDirection = `character_${this.userProfile.trainer[0]}_left0`;
        break;

      case 'right':
        viewX += step;
        characterDirection = `character_${this.userProfile.trainer[0]}_right0`;
        break;

      default:
        return;
    }


    this.userProfile.direction = characterDirection;

    this.setState(
      {
        viewY,
        viewX,
        characterDirection,
        pokemons,

      },
      () => {
        this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight);
        this.lastScroll = performance.now();
        const { controller, reportPosition } = this.props;
        if (this.config.host) {
          reportPosition(
            {
              player: controller,
              x: viewX + 6,
              y: viewY + 6,
              profile: this.userProfile,
            },
            pokemons,
          );
        } else {
          reportPosition({
            player: controller,
            x: viewX + 6,
            y: viewY + 6,
            profile: this.userProfile,
          });
        }
      },
    );
  };

  addNewBonus = (amount) => {
    const { map } = this.state;
    let randomPosition = Math.floor(Math.random() * map.length - 1);
    const { bonusMap } = this.state;

    if (randomPosition < 10) {
      randomPosition += 5;
    }
    if (randomPosition > map.length - 10) {
      randomPosition -= 5;
    }
    if (!map[randomPosition][randomPosition].includes(-1)) {
      for (let i = 0; i < amount; i += 1) {
        const pokeBall = new Bonus(0, randomPosition, randomPosition);
        bonusMap.push(pokeBall);
      }
      this.setState({ bonusMap });
    } else {
      randomPosition = Math.floor(Math.random() * map.length - 1);
    }
  };

  updateViewMap = (matrix, offsetX, offsetY, width, height) => {
    if (offsetX + width > matrix[0].length) return;
    if (offsetY + height > matrix.length) return;
    const subMatrix = [];
    for (let i = offsetY; i < height + offsetY; i += 1) {
      const index = subMatrix.push(JSON.parse(JSON.stringify(matrix[i]))) - 1;
      subMatrix[index] = subMatrix[index].slice(offsetX, offsetX + width);
    }
    // eslint-disable-next-line consistent-return
    return subMatrix;
  };

  addNewPokemon = (amount, id) => {
    let speed = 1;
    const { map } = this.state;
    const { pokemons } = this.state;
    if (id - 9001 < 120) {
      speed += 2;
    }
    let randomPosition = Math.floor(Math.random() * 30);
    if (!map[randomPosition][randomPosition].includes(-1)) {
      for (let i = 0; i < amount; i += 1) {
        if (randomPosition < 5) {
          randomPosition += 5;
        }
        if (randomPosition > 30) {
          randomPosition -= 5;
        }
        const poke = new Pokemon(
          id,
          this.pokeBase[id - 9001].name,
          randomPosition,
          randomPosition,
          map,
          speed,
        );
        poke.init();
        pokemons.push(poke);
      }
      this.setState({ pokemons });
    } else {
      randomPosition = Math.floor(Math.random() * 30);
    }
  };

  run = () => {
    if (this.loaded < 3) return;
    if (!this.pokeBase) return;
    const {
      asyncKeys, controls, reportPosition, getPlayerPosition, controller,
    } = this.props;
    const pokemonRandom = Math.floor(Math.random() * 151) + 9001;
    const {
      viewX, viewY, viewWidth, viewHeight, map, bonus, bonusMap,
    } = this.state;
    let {
      visiblePokemons, view, payerGhosts, pokemons, visibleBonus,
    } = this.state;
    if (this.debugMode) this.loopCounter += 1;
    if (pokemons.length < 1 && this.config.host) { this.addNewPokemon(1, pokemonRandom); }

    if (bonusMap.length < 1) { this.addNewBonus(1); }
    view = this.updateViewMap(map, viewX, viewY, viewWidth, viewHeight);

    if (this.config.multiplayerMode) {
      // get other players location
      const players = getPlayerPosition(this.user);
      if (players) {
        payerGhosts = players.joueurs.filter(
          player => player.pos.y >= viewY
            && player.pos.y < viewY + viewHeight
            && player.pos.x >= viewX
            && player.pos.x < viewX + viewWidth,
        );

        if (!this.config.host) {
          visiblePokemons = players.pokemons.filter(
            poke => poke.y >= viewY
              && poke.y < viewY + viewHeight
              && poke.x >= viewX
              && poke.x < viewX + viewWidth,
          );
        }
        if (this.config.host && players.update) {
          // eslint-disable-next-line prefer-destructuring
          pokemons = players.pokemons;
          reportPosition(
            {
              player: controller,
              x: viewX + 6,
              y: viewY + 6,
              profile: this.userProfile,
            },
            undefined,
            true,
          );
        }
      }
    } else { // Enable Bonus system
      // BONUS //

      if (bonusMap.length > 0 && this.config.host) {
        visibleBonus = bonusMap.filter(
          visible => visible.y >= viewY
            && visible.y < viewY + viewHeight
            && visible.x >= viewX
            && visible.x < viewX + viewWidth,
        );
      }

      if (visibleBonus.length > 0) {
        visibleBonus.map(power => view[power.y - viewY][power.x - viewX].push(2173));
      }

      if (
        view[Math.floor(view.length / 2)][
          Math.floor(view.length / 2)
        ].includes(2173)
      ) {
        bonusMap.length = 0;
        const randomBonus = Math.floor(Math.random() * 3);
        const bonus1 = new Bonus(randomBonus);

        bonus1.run();
        this.setState({
          bonus: bonus1,
          bonusMap,
        });
      }

      if (bonus.speedPokemon && !bonus.slowPokemon) {
        pokemons.speed = 15;
      } else {
        pokemons.speed = 2;
      }
      if (bonus.slowPokemon && !bonus.speedPokemon) {
        pokemons.speed = 1;
      } else {
        pokemons.speed = 2;
      }
      if (bonus.catchPokemon) {
        this.catchBonus = true;
      } else {
        this.catchBonus = false;
      }
    }

    if (pokemons.length > 0 && this.config.host) {
      pokemons.map(poke => poke.run());
      visiblePokemons = pokemons.filter(
        poke => poke.y >= viewY
          && poke.y < viewY + viewHeight
          && poke.x >= viewX
          && poke.x < viewX + viewWidth,
      );
    }

    if (pokemons.length > 0) {
      pokemons = pokemons.filter(poke => !poke.catched);
    }

    if (payerGhosts.length > 0) {
      payerGhosts.map(player => view[player.pos.y - viewY][player.pos.x - viewX].push(
        player.profile.direction,
      ));
    }

    if (visiblePokemons.length > 0) {
      visiblePokemons.map((poke) => {
        view[poke.y - viewY][poke.x - viewX].push(poke.id);
        if (
          view[Math.floor(view.length / 2)][
            Math.floor(view.length / 2)
          ].includes(poke.id)
        ) {
          if (asyncKeys[4] === controls[4] || this.catchBonus === 1) {
            this.catched = poke.name;
            pokemons = this.catch(poke.id);
            reportPosition({
              player: controller, x: viewX + 6, y: viewY + 6, profile: this.userProfile,
            }, pokemons);

            // End game
            // clearInterval(this.running);

            // save new pokemon to local storage
            this.userProfile.pokemon.push((poke.id - 9000).toString());
            localStorage.setItem(this.user, JSON.stringify(this.userProfile));
          }
        }
        return undefined;
      });
    }

    this.setState({
      view: [...view],
      visiblePokemons,
      payerGhosts,
      pokemons,
    });

    this.checkKeyboard();
    this.checkGamepad(controller);
  };

  catch = (pokeId) => {
    const { pokemons } = this.state;

    for (let i = 0; i < pokemons.length; i += 1) {
      if (pokemons[i].id === pokeId) {
        pokemons[i].catched = true;
      }
    }

    return pokemons;
  };

  debug = () => {
    if (!this.debugMode) return;
    this.renderCounter += 1;
    // eslint-disable-next-line consistent-return
    return (
      <h3
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        {`Render No ${this.renderCounter} Loop No ${this.loopCounter}`}
      </h3>
    );
  };

  render() {
    const { view, characterDirection } = this.state;
    const { asyncKeys, controller } = this.props;
    return (
      <div style={this.theme}>
        {this.debugMode ? this.debug() : null}
        {this.loaded ? (
          view.map((row, i) => (
            <MemorizedRow data={row} index={i} key={`row-${i + 1}`} />
          ))
        ) : (
          <h1 style={{ margin: '50% auto' }}>
          LOADING..
            {this.loaded}
          </h1>
        )}

        {this.catched ? (
          <MemorizedAlert
            pokemon={this.catched}
            player={controller}
            name={this.user}
          />
        ) : null}

        <Player
          activeKeys={asyncKeys}
          direction={characterDirection}
          username={this.user}
        />
      </div>
    );
  }
}

export default Map;
