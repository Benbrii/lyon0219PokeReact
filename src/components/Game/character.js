import Easystar from 'easystarjs';
import { ableToMove, convertToCollideMap } from './utils';

class Character {
  constructor(name, y, x, playground) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.playground = { matrix: playground };
  }

  init() {
    this.playground.width = this.playground.matrix[0].length;
    this.playground.height = this.playground.matrix.length;
    this.direction = this.randomDirection();
    this.collisionMap = convertToCollideMap(this.playground.matrix);
    this.aStar = new Easystar.js();
    this.aStar.setGrid(this.collisionMap);
    this.aStar.setAcceptableTiles([0]);
  }

  randomDirection = () => {
    const dirs = ['up', 'down', 'right', 'left'];
    return dirs[Math.floor(Math.random() * 4)];
  }


  goto(destX, destY, call) {
    this.moving = true;
    this.aStar.findPath(this.x, this.y, destX, destY, (path) => {
      if (path === null) {
        // eslint-disable-next-line no-alert
        this.moving = false;
        // console.log('Path was not found.');
      } else {
        // eslint-disable-next-line no-alert
        this.moving = true
        //this.previousSpeed = this.speed;
        if (this.speed < 1.55 && call){
          this.speed = 1.55;
        }
        this.path = path;
        // console.log(path)
        // console.log(`Path was found. The first Point is ${path[0].x} ${path[0].y}`);
      }
    });
  }
}

class Pokemon extends Character {
  constructor(id, name, x, y, playground, speed) {
    super(name, x, y, playground);
    this.id = id;
    this.speed = speed;
    this.catched = false;
  }


  run() {
    if (!this.lastMove) { this.lastMove = this.lastMove = performance.now(); return; }
    if (performance.now() - this.lastMove < 1000 / this.speed) return;

    if (this.moving) {
      this.aStar.calculate();
      if (!this.path) return;
      if (this.path.length > 0) {
        const step = this.path[0];
        this.x = step.x;
        this.y = step.y;
        this.path.shift();
        // console.log(this.path)
        this.lastMove = performance.now();
      } else {
        this.moving = false;
        this.speed = 1;
      }
      return;
    }

    if (ableToMove({ x: this.x, y: this.y }, this.direction, 1, this.playground.matrix)) {
      if ((this.direction === 'up') || (this.direction === 'down')) {
        if (this.direction === 'up') {
          this.y -= 1;
        } else {
          this.y += 1;
        }
      } else if ((this.direction === 'right') || (this.direction === 'left')) {
        if (this.direction === 'right') {
          this.x += 1;
        } else {
          this.x -= 1;
        }
      }
    } else {
      this.direction = this.randomDirection();
    }
    this.lastMove = performance.now();
  }

  catch() {
    this.catched = true;
  }
}

class Player extends Character {
  constructor(name, y, x) {
    super(name, y, x);
  }
}

export { Character, Pokemon };
