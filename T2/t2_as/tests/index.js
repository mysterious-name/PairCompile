import assert from "assert";

// Choose proper "import" depending on your PL.
import { greedySnakeMoveBarriers } from "../build/debug.js";
// import { greedy_snake_move_barriers as greedySnakeMoveBarriers } from "./t2_rust/pkg/t2_rust.js"
// [Write your own "import" for other PLs.]

function greedy_snake_barriers_checker(initial_snake, food_num, foods, barriers, access) {
    if (initial_snake.length !== 8) throw "Invalid snake length";

    let current_snake = [...initial_snake];
    let current_foods = [...foods];
    const barriers_list = [];
    for (let i = 0; i < barriers.length; i += 2) {
        const x = barriers[i];
        const y = barriers[i + 1];
        if (x !== -1 && y !== -1) {
            barriers_list.push({ x, y });
        }
    }
    let turn = 1;

    while (turn <= 200) {
        const direction = greedySnakeMoveBarriers(current_snake, current_foods, barriers);

        if (access === 0) {
            if (direction !== -1) {
                return -5;
            } else {
                return 1;
            }
        }

        // invalid direction
        if (direction < 0 || direction > 3) return -4;

        let new_snake = [
            current_snake[0] + (direction == 3) - (direction == 1),
            current_snake[1] + (direction == 0) - (direction == 2),
            current_snake[0],
            current_snake[1],
            current_snake[2],
            current_snake[3],
            current_snake[4],
            current_snake[5],
        ];


        // out of range
        if (new_snake[0] < 1 || new_snake[0] > 8 || new_snake[1] < 1 || new_snake[1] > 8) return -1;

        // hit a barrier
        if (barriers_list.some(ob => ob.x === new_snake[0] && ob.y === new_snake[1])) return -2;

        // eat food
        let ate_index = -1;
        for (let i = 0; i < current_foods.length; i += 2) {
            if (new_snake[0] === current_foods[i] && new_snake[1] === current_foods[i + 1]) {
                ate_index = i;
                break;
            }
        }

        // console.log("turn " + turn + " :" + direction);
        if (ate_index !== -1) {
            current_foods.splice(ate_index, 2);
            food_num -= 1;
        }

        if (food_num === 0) {
            console.log("Total turn: " + turn);
            return turn;
        }

        current_snake = new_snake;
        turn++;
    }

    // timeout
    return -3;
}
// 测试1：蛇被障碍环形包围（必须突破）
assert.strictEqual(
    greedy_snake_barriers_checker(
        [4, 4, 4, 5, 5, 5, 5, 4],
        1,
        [8, 8],
        [3, 3, 4, 3, 5, 3, 6, 3, 3, 6, 4, 6, 5, 6, 6, 6, 3, 4, 3, 4, 6, 5, 1, 1],
        1
    ) === 8,
    true,
);

// 测试2：障碍弯曲导航（严格12障碍）
assert.strictEqual(
    greedy_snake_barriers_checker(
        [1, 4, 1, 3, 1, 2, 1, 1],
        1,
        [5, 8],
        [3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 4, 7, 4, 8, 5, 1, 5, 2, 5, 3, 5, 4, 5, 5],
        1
    ) === 12,
    true
);


// 测试3：蛇被障碍环形包围（无法突破）
assert.strictEqual(
    greedy_snake_barriers_checker(
        [4, 4, 4, 5, 5, 5, 5, 4],
        1,
        [8, 8],
        [3, 3, 3, 4, 3, 5, 3, 6, 4, 6, 5, 6, 6, 6, 6, 5, 6, 4, 6, 3, 5, 3, 4, 3],
        0
    ),
    1,
);

// 测试4：蛇身障碍(无法突破）
assert.strictEqual(
    greedy_snake_barriers_checker(
        [8, 6, 8, 5, 8, 4, 8, 3],
        1,
        [8, 1],
        [7, 8, 7, 7, 7, 6, 7, 5, 7, 4, 7, 3, 7, 2, 7, 1, 1, 1, 1, 2, 1, 3, 1, 4],
        0
    ),
    1,
);

console.log("🎉 You have passed all the tests provided.");