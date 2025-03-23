export function greedySnakeMoveBarriers(body: i32[], fruit: i32[], barriers: i32[]): i32 {
  console.log("begin\n");
  const headPoint = trans2Point(body[0], body[1]);
  let bodyPoint1 = trans2Point(body[2], body[3]);
  let bodyPoint2 = trans2Point(body[4], body[5]);
  let bodyPoint3 = trans2Point(body[6], body[7]);
  let fruitPoint = trans2Point(fruit[0], fruit[1]);
  const visited = new Set<i32>();
  const queue = new Array<i32>();
  const blockBarriers = new Set<i32>();
  initBlockBarriers(blockBarriers, barriers);
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
      console.log("find a way to fruit\n");
      return getDirection(headPoint, point);
    }
    if (!exceedBound(x + 1, y) && !isBarrier(x + 1, y, blockBarriers) && !visited.has(trans2Point(x + 1, y)) && !isGoBack(point, x + 1, y, pathMap)) {
      queue[queueEnd++] = (x + 1) * 8 + y;
      pathMap[(x + 1) * 8 + y] = point;
    }
    if (!exceedBound(x - 1, y) && !isBarrier(x - 1, y, blockBarriers) && !visited.has(trans2Point(x - 1, y)) && !isGoBack(point, x - 1, y, pathMap)) {
      queue[queueEnd++] = (x - 1) * 8 + y;
      pathMap[(x - 1) * 8 + y] = point;
    }
    if (!exceedBound(x, y + 1) && !isBarrier(x, y + 1, blockBarriers) && !visited.has(trans2Point(x, y + 1)) && !isGoBack(point, x, y + 1, pathMap)) {
      queue[queueEnd++] = x * 8 + y + 1;
      pathMap[x * 8 + y + 1] = point;
    }
    if (!exceedBound(x, y - 1) && !isBarrier(x, y - 1, blockBarriers) && !visited.has(trans2Point(x, y - 1)) && !isGoBack(point, x, y - 1, pathMap)) {
      queue[queueEnd++] = x * 8 + y - 1;
      pathMap[x * 8 + y - 1] = point;
    }
  }
  console.log("fail to find a way to fruit\n");
  return -1;
}


function exceedBound(x: i32, y: i32): bool {
  return x < 1 || x > 8 || y < 1 || y > 8;
}

function isBarrier(x: i32, y: i32, barriers: Set<i32>): bool {
  return barriers.has(x * 8 + y);
}

function trans2Point(x: i32, y: i32): i32 {
  return x * 8 + y;
}

function initPathMap(pathMap: i32[], headPoint: i32, bodyPoint1: i32,
  bodyPoint2: i32, bodyPoint3: i32): void {
  pathMap[headPoint] = bodyPoint1;
  pathMap[bodyPoint1] = bodyPoint2;
  pathMap[bodyPoint2] = bodyPoint3;
}

function getDirection(headPoint: i32, point: i32): i32 {
  let next_x = point / 8;
  let next_y = point % 8;
  let head_x = headPoint / 8;
  let head_y = headPoint % 8;
  console.log(headPoint.toString());
  console.log(next_x.toString());
  console.log(next_y.toString());
  if (next_x === head_x + 1) {
    console.log("right");
    return 3;
  }
  if (next_x === head_x - 1) {
    console.log("left");
    return 1;
  }
  if (next_y === head_y + 1) {
    console.log("up");
    return 0;
  }
  if (next_y === head_y - 1) {
    console.log("down");
    return 2;
  }
  return -1;
}

// function updateSnakeBarriers(snakeBarriers: Set<i32>, pathMap: i32[], point: i32): void {
//   snakeBarriers.clear();
//   const snakeBarrier1 = pathMap[point];
//   const snakeBarrier2 = pathMap[snakeBarrier1];
//   const snakeBarrier3 = pathMap[snakeBarrier2];
//   snakeBarriers.add(snakeBarrier1);
//   snakeBarriers.add(snakeBarrier2);
//   // snakeBarriers.add(snakeBarrier3);
// }

function isGoBack(headPoint: i32, x: i32, y: i32, pathMap: i32[]): bool {
  let nextPoint = x * 8 + y;
  let prevPoint = pathMap[headPoint];
  return nextPoint === prevPoint;
}

function initBlockBarriers(blockBarriers: Set<i32>, barriers: i32[]): void {
  for (let i = 0; i < barriers.length; i += 2) {
    blockBarriers.add(trans2Point(barriers[i], barriers[i + 1]));
  }
}

function debugPrint(point: i32): void {
  let x = point / 8;
  let y = point % 8;
  console.log("x: ");
  console.log(x.toString());
  console.log("y: ");
  console.log(y.toString());
  console.log("\n");
}