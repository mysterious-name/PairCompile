var map_size = 0;

export function greedy_snake_step(n: i32, snake: i32[], snake_num: i32, enemy_snake: i32[],
  food_num: i32, foods: i32[], round: i32): i32 {
  map_size = n;
  return cal_food_dis(snake, snake_num, enemy_snake, food_num, foods);
}

function cal_food_dis(snake: i32[], snake_num: i32, enemy_snake: i32[],
  food_num: i32, foods: i32[]): i32 {
  let good_foods: Array<i32> = new Array<i32>();
  let equal_foods: Array<i32> = new Array<i32>();
  let bad_foods: Array<i32> = new Array<i32>();
  for (let i = 0; i < food_num; i++) {
    let dis = 0;
    let min_dis = 0xffff;
    let my_dis = cal_single_dis(snake, [foods[2 * i], foods[2 * i + 1]]);
    for (let j = 0; j < snake_num; j++) {
      dis = cal_single_dis(snake, [enemy_snake[2 * j], enemy_snake[2 * j + 1]]);
      min_dis = Math.min(min_dis, dis) as i32;
    }
    if (my_dis < min_dis - 1) {
      good_foods.push(i);//离我们近的好果子
    } else if (my_dis > min_dis + 1) {
      bad_foods.push(i);//离我们远的坏果子
    } else {
      equal_foods.push(i);//离我们一样远的果子
    }
  }
  var save_food = -1;
  var save_score = -0xffff;
  for (let i = 0; i < good_foods.length; i++) {
    let score = 0;
    for (let j = 0; j < bad_foods.length; j++) {
      score += cal_single_dis([foods[2 * bad_foods[j]], foods[2 * bad_foods[j] + 1]],
        [foods[2 * good_foods[i]], foods[2 * good_foods[i] + 1]]);
      //计算每个好果子到坏果子的综合距离
    }
    score -= cal_single_dis(snake, [foods[2 * good_foods[i]], foods[2 * good_foods[i] + 1]]) * (bad_foods.length + 1);
    //计算每个好果子到我们身体的距离
    if (score > save_score) {
      save_score = score;
      save_food = good_foods[i];
    }
  }
  if (save_food !== -1) {
    //待选方向
    let direction = search_food(snake, snake_num, enemy_snake, [foods[2 * save_food], foods[2 * save_food + 1]]);
    return direction;
  }
  for (let i = 0; i < equal_foods.length; i++) {
    let score = 0;
    for (let j = 0; j < bad_foods.length; j++) {
      score += cal_single_dis([foods[2 * bad_foods[j]], foods[2 * bad_foods[j] + 1]],
        [foods[2 * equal_foods[i]], foods[2 * equal_foods[i] + 1]]);
      //计算每个平等果子到坏果子的综合距离
    }
    score -= cal_single_dis(snake, [foods[2 * equal_foods[i]], foods[2 * equal_foods[i] + 1]]) * bad_foods.length;
    //计算每个平等果子到我们身体的距离
    if (score > save_score) {
      save_score = score;
      save_food = equal_foods[i];
    }

  }
  if (save_food !== -1) {
    //待选方向
    let direction = search_food(snake, snake_num, enemy_snake, [foods[2 * save_food], foods[2 * save_food + 1]]);
    return direction;
  }
  return wander(snake, snake_num, enemy_snake);

}

function cal_single_dis(snake: i32[], food: i32[]): i32 {
  return (Math.abs(snake[0] - food[0]) + Math.abs(snake[1] - food[1])) as i32;
}

function wander(snake: i32[], snake_num: i32, enemy_snake: i32[],
): i32 {
  const barriers = new Set<i32>();
  initBlockBarriers(barriers, snake_num, enemy_snake);
  let targets: Array<i32> = new Array<i32>();
  let head_x = snake[0];
  let head_y = snake[1];
  if (!barriers.has(trans2Point(head_x, head_y + 1)) && !exceedBound(head_x, head_y + 1)) {
    targets.push(trans2Point(head_x, head_y + 1))
  } else {
    targets.push(-1);
  }
  if (!barriers.has(trans2Point(head_x - 1, head_y)) && !exceedBound(head_x - 1, head_y)) {
    targets.push(trans2Point(head_x - 1, head_y))
  } else {
    targets.push(-1);
  }
  if (!barriers.has(trans2Point(head_x, head_y - 1)) && !exceedBound(head_x, head_y - 1)) {
    targets.push(trans2Point(head_x, head_y - 1))
  } else {
    targets.push(-1);
  }
  if (!barriers.has(trans2Point(head_x + 1, head_y)) && !exceedBound(head_x + 1, head_y)) {
    targets.push(trans2Point(head_x + 1, head_y))
  } else {
    targets.push(-1);
  }
  let enemy_dis = 0xffff;
  var save = -1;
  for (let i = 0; i < targets.length; i++) {
    if (targets[i] === -1) {
      continue;
    }
    let temp = cal_enemy_dis(targets[i], snake_num, enemy_snake);
    if (enemy_dis < temp) {
      enemy_dis = temp;
      save = i;
    }
  }
  if (save === -1) {
    return bind(snake, snake_num, enemy_snake);
  }
  return save;
}
function cal_enemy_dis(target: i32, snake_num: i32, enemy_snake: i32[]): i32 {
  let score = 0;
  let x = target / map_size;
  let y = target % map_size + 1;
  for (let i = 0; i < enemy_snake.length; i += 2) {
    score += (Math.abs(enemy_snake[i] - x) + Math.abs(enemy_snake[i + 1] - y)) as i32;
  }
  score -= (4 * Math.max(Math.abs(2 * x - (map_size + 1)), Math.abs(2 * y - (1 + map_size)))) as i32;
  return score;
}


function search_food(body: i32[], snake_num: i32, enemy_snake: i32[],
  food: i32[]): i32 {
  const headPoint = trans2Point(body[0], body[1]);
  let bodyPoint1 = trans2Point(body[2], body[3]);
  let bodyPoint2 = trans2Point(body[4], body[5]);
  let bodyPoint3 = trans2Point(body[6], body[7]);
  let fruitPoint = trans2Point(food[0], food[1]);
  const visited = new Set<i32>();
  const queue = new Array<i32>();
  const blockBarriers = new Set<i32>();
  initBlockBarriers(blockBarriers, snake_num, enemy_snake);
  let queueBegin = 0;
  let queueEnd = 0;
  const pathMap = new Array<i32>(100);
  initPathMap(pathMap, headPoint, bodyPoint1, bodyPoint2, bodyPoint3);
  queue[queueEnd++] = headPoint;
  let flag = false;
  while (queueBegin < queueEnd) {
    let point = queue[queueBegin++];
    visited.add(point);
    let x = point / map_size;
    let y = point % map_size + 1;
    if (point === fruitPoint) {
      while (pathMap[point] !== headPoint) {
        point = pathMap[point];
      }
      return getDirection(headPoint, point);
    }
    if (!exceedBound(x + 1, y) && !isBarrierSnake(x + 1, y, blockBarriers, flag) && !visited.has(trans2Point(x + 1, y)) && !isGoBack(point, x + 1, y, pathMap)) {
      queue[queueEnd++] = trans2Point(x + 1, y);
      pathMap[trans2Point(x + 1, y)] = point;
    }
    if (!exceedBound(x - 1, y) && !isBarrierSnake(x - 1, y, blockBarriers, flag) && !visited.has(trans2Point(x - 1, y)) && !isGoBack(point, x - 1, y, pathMap)) {
      queue[queueEnd++] = trans2Point(x - 1, y);
      pathMap[trans2Point(x - 1, y)] = point;
    }
    if (!exceedBound(x, y + 1) && !isBarrierSnake(x, y + 1, blockBarriers, flag) && !visited.has(trans2Point(x, y + 1)) && !isGoBack(point, x, y + 1, pathMap)) {
      queue[queueEnd++] = trans2Point(x, y + 1);
      pathMap[trans2Point(x, y + 1)] = point;
    }
    if (!exceedBound(x, y - 1) && !isBarrierSnake(x, y - 1, blockBarriers, flag) && !visited.has(trans2Point(x, y - 1)) && !isGoBack(point, x, y - 1, pathMap)) {
      queue[queueEnd++] = trans2Point(x, y - 1);
      pathMap[trans2Point(x, y - 1)] = point;
    }
    flag = true;
  }

  return bind(body, snake_num, enemy_snake);//没有找到食物，开始概率行为
}


function exceedBound(x: i32, y: i32): bool {
  return x < 1 || x > map_size || y < 1 || y > map_size;
}

function isBarrierSnake(x: i32, y: i32, barriers: Set<i32>, judge: bool): bool {
  return !judge && barriers.has(trans2Point(x, y));//judge意味着安全模式，不考虑障碍物
}

function trans2Point(x: i32, y: i32): i32 {
  return x * map_size + y - 1;
}

function initPathMap(pathMap: i32[], headPoint: i32, bodyPoint1: i32,
  bodyPoint2: i32, bodyPoint3: i32): void {
  pathMap[headPoint] = bodyPoint1;
  pathMap[bodyPoint1] = bodyPoint2;
  pathMap[bodyPoint2] = bodyPoint3;
}

function getDirection(headPoint: i32, point: i32): i32 {
  let next_x = point / map_size;
  let next_y = point % map_size + 1;
  let head_x = headPoint / map_size;
  let head_y = headPoint % map_size + 1;
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

function isGoBack(headPoint: i32, x: i32, y: i32, pathMap: i32[]): bool {
  let nextPoint = trans2Point(x, y);
  let prevPoint = pathMap[headPoint];
  return nextPoint === prevPoint;
}

function initBlockBarriers(blockBarriers: Set<i32>, snake_num: i32, enemy_snake: i32[]): void {
  for (let i = 0; i < snake_num; i++) {
    // 将其他蛇的身体（除尾巴）添加到障碍物中
    let point = trans2Point(enemy_snake[8 * i], enemy_snake[8 * i + 1]);
    blockBarriers.add(point);
    point = trans2Point(enemy_snake[8 * i + 2], enemy_snake[8 * i + 3]);
    blockBarriers.add(point);
    point = trans2Point(enemy_snake[8 * i + 4], enemy_snake[8 * i + 5]);
    blockBarriers.add(point);
  }
  // 将蛇头可能到达的方块添加到障碍物中
  for (let i = 0; i < snake_num; i++) {
    let x = enemy_snake[8 * i];
    let y = enemy_snake[8 * i + 1];
    // 这里未考虑出界的情况，因为无所谓
    blockBarriers.add(trans2Point(x - 1, y));
    blockBarriers.add(trans2Point(x + 1, y));
    blockBarriers.add(trans2Point(x, y - 1));
    blockBarriers.add(trans2Point(x, y + 1));

  }
}

function getSnakeHead(grayBlock: i32[], snake_num: i32, enemy_snake: i32[], body: i32[]): void {
  //初始化为0
  for (let i = 0; i < grayBlock.length; i++) {
    grayBlock[i] = 0;
  }
  for (let i = 0; i < snake_num; i++) {
    let x = enemy_snake[8 * i];
    let y = enemy_snake[8 * i + 1];
    // 统计这些灰色格子被蛇头命中的次数
    grayBlock[trans2Point(x - 1, y)]++;
    grayBlock[trans2Point(x + 1, y)]++;
    grayBlock[trans2Point(x, y - 1)]++;
    grayBlock[trans2Point(x, y + 1)]++;
  }
  for (let i = 0; i < snake_num; i++) {
    // 将其他蛇的身体（除尾巴）添加到障碍物中
    let point = trans2Point(enemy_snake[8 * i], enemy_snake[8 * i + 1]);
    grayBlock[point] = 0xffff;
    point = trans2Point(enemy_snake[8 * i + 2], enemy_snake[8 * i + 3]);
    grayBlock[point] = 0xffff;
    point = trans2Point(enemy_snake[8 * i + 4], enemy_snake[8 * i + 5]);
    grayBlock[point] = 0xffff;
  }//障碍物将会非常大，以致于有限不选择障碍物

  let point = trans2Point(body[2], body[3]);
  grayBlock[point] = 0xffff;

}

function bind(snake: i32[], snake_num: i32, enemy_snake: i32[]): i32 {
  const grayBlock = new Array<i32>(100);
  // 如果没有找到食物，开始概率行为
  getSnakeHead(grayBlock, snake_num, enemy_snake, snake);
  const directions = new Array<i32>(4);
  if (exceedBound(snake[0], snake[1] + 1)) {
    directions[0] = 0xffff;
  } else {
    directions[0] = grayBlock[trans2Point(snake[0], snake[1] + 1)];
  }
  if (exceedBound(snake[0] - 1, snake[1])) {
    directions[1] = 0xffff;
  } else {
    directions[1] = grayBlock[trans2Point(snake[0] - 1, snake[1])];
  }
  if (exceedBound(snake[0], snake[1] - 1)) {
    directions[2] = 0xffff;
  }
  else {
    directions[2] = grayBlock[trans2Point(snake[0], snake[1] - 1)];
  }
  if (exceedBound(snake[0] + 1, snake[1])) {
    directions[3] = 0xffff;
  } else {
    directions[3] = grayBlock[trans2Point(snake[0] + 1, snake[1])];
  }
  let minVal = directions[0];
  let minIndices: i32[] = [0];
  for (let i = 1; i < directions.length; i++) {
    const current = directions[i];
    if (current < minVal) {
      minVal = current;
      minIndices = [i];
    } else if (current === minVal) {
      minIndices.push(i);
    }
  }
  // 随机选择一个索引
  const randomDirection = Math.floor(Math.random() * minIndices.length) as i32;
  const selectedDirection = minIndices[randomDirection];
  return selectedDirection;
}
