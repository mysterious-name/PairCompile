// The entry file of your WebAssembly module.
export function greed_snake_move(body: i32[], fruit: i32[]): i32 {
  let headPoint = trans2Point(body[0], body[1]);
  let bodyPoint1 = trans2Point(body[2], body[3]);
  let bodyPoint2 = trans2Point(body[4], body[5]);
  let bodyPoint3 = trans2Point(body[6], body[7]);
  let fruitPoint = trans2Point(fruit[0], fruit[1]);
  const snakeBarriers = new Set<i32>();
  const visited = new Set<i32>();
  const queue = new Array<i32>();
  let queueBegin = 0;
  let queueEnd = 0;
  const pathMap = new Array<i32>(64);
  initPathMap(pathMap, headPoint, bodyPoint1, bodyPoint2, bodyPoint3);
  queue[queueEnd++] = headPoint;
  while (queueBegin < queueEnd) {
    let point = queue[queueBegin++];
    visited.add(point);
    let x = point / 8;
    let y = point % 8;
    if (point === fruitPoint) {
      while (pathMap[point] !== headPoint) {
        point = pathMap[point];
      }
      return getDirection(headPoint, x, y);
    }
    updateSnakeBarriers(snakeBarriers, pathMap, point);
    if (!exceedBound(x + 1, y) && !isBarrier(x + 1, y, snakeBarriers) && !visited.has(trans2Point(x + 1, y))) {
      queue[queueEnd++] = (x + 1) * 8 + y;
      pathMap[(x + 1) * 8 + y] = point;
    }
    if (!exceedBound(x - 1, y) && !isBarrier(x - 1, y, snakeBarriers) && !visited.has(trans2Point(x - 1, y))) {
      queue[queueEnd++] = (x - 1) * 8 + y;
      pathMap[(x - 1) * 8 + y] = point;
    }
    if (!exceedBound(x, y + 1) && !isBarrier(x, y + 1, snakeBarriers) && !visited.has(trans2Point(x, y + 1))) {
      queue[queueEnd++] = x * 8 + y + 1;
      pathMap[x * 8 + y + 1] = point;
    }
    if (!exceedBound(x, y - 1) && !isBarrier(x, y - 1, snakeBarriers) && !visited.has(trans2Point(x, y - 1))) {
      queue[queueEnd++] = x * 8 + y - 1;
      pathMap[x * 8 + y - 1] = point;
    }
  }
  return -1;
}


function exceedBound(x: i32, y: i32): bool {
  return x < 1 || x > 8 || y < 1 || y > 8;
}

function isBarrier(x: i32, y: i32, barriers: Set<i32>): bool {
  return barriers.has(x * 8 + y);
}

function trans2Point(x: i32, y: i32): i32 {
  return (x / 8) + (y % 8);
}

function initPathMap(pathMap: i32[], headPoint: i32, bodyPoint1: i32,
  bodyPoint2: i32, bodyPoint3: i32): void {
  pathMap[headPoint] = bodyPoint1;
  pathMap[bodyPoint1] = bodyPoint2;
  pathMap[bodyPoint2] = bodyPoint3;
}

function getDirection(point: i32, next_x: i32, next_y: i32): i32 {
  let head_x = point / 8;
  let head_y = point % 8;
  if (next_x === head_x + 1) {
    return 3;
  }
  if (next_x === head_x - 1) {
    return 1;
  }
  if (next_y === head_y + 1) {
    return 0;
  }
  if (next_y === head_y - 1) {
    return 2;
  }
  return -1;
}

function updateSnakeBarriers(snakeBarriers: Set<i32>, pathMap: i32[], point: i32): void {
  snakeBarriers.clear();
  const snakeBarrier1 = pathMap[point];
  const snakeBarrier2 = pathMap[snakeBarrier1];
  const snakeBarrier3 = pathMap[snakeBarrier2];
  snakeBarriers.add(snakeBarrier1);
  snakeBarriers.add(snakeBarrier2);
  snakeBarriers.add(snakeBarrier3);
}