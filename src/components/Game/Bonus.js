class Bonus {
  constructor(random, x, y, map) {
    this.random = random;
    this.x = x;
    this.y = y;
    this.map = map;
  }


  run() {
    if (this.random === 0) {
      this.slowPokemon = true;
      setTimeout(() => {
        this.slowPokemon = false;
      }, 30000);
    }
    if (this.random === 1) {
      this.speedPokemon = true;
      setTimeout(() => {
        this.speedPokemon = false;
      }, 30000);
    }
    if (this.random === 2) {
      this.catchPokemon = true;
      setTimeout(() => {
        this.catchPokemon = false;
      }, 30000);
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export { Bonus };
