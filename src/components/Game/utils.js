export const ableToMove = (pos, direction, step, playground) => {
  const newPos = { x: pos.x, y: pos.y };

  switch (direction) {
    case 'up':
      newPos.y -= step;
      break;

    case 'down':
      newPos.y += step;
      break;

    case 'right':
      newPos.x += step;
      break;

    case 'left':
      newPos.x -= step;
      break;

    default:
      return undefined;
  }

  return !playground[newPos.y][newPos.x].includes(-1);
};

export const convertToCollideMap = (arr) => {
  const output = [];
  for (let i = 0; i < arr.length; i += 1) {
    const row = [];
    for (let j = 0; j < arr[i].length; j += 1) {
      if (arr[i][j].includes(-1)) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    output.push(row);
  }
  return output;
};
