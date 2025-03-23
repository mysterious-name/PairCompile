import assert from "assert";
// Choose proper "import" depending on your PL.
import { greedy_snake_move } from "../build/debug.js";
// import { greedy_snake_move } from "./t1_rust/pkg/t1_rust.js";
// [Write your own "import" for other PLs.]

function greedy_snake_fn_checker (snake, food) {
    let now_snake = [
        snake[0], snake[1], snake[2], snake[3], snake[4], snake[5], snake[6], snake[7]
    ];
    let turn = 1;
    while (true) {
        let result = greedy_snake_move(now_snake, food);
        let new_snake = [
            now_snake[0] + (result == 3) - (result == 1),
            now_snake[1] + (result == 0) - (result == 2),
            now_snake[0],
            now_snake[1],
            now_snake[2],
            now_snake[3],
            now_snake[4],
            now_snake[5],
        ];
        if (new_snake[0] < 1 || new_snake[0] > 8 || new_snake[1] < 1 || new_snake[1] > 8) {
            return -1;
        }
        if (new_snake[0] == new_snake[4] && new_snake[1] == new_snake[5]) {
            return -2;
        }
        if (new_snake[0] == food[0] && new_snake[1] == food[1]) {
            console.log("Total turn: " + turn);
            return turn;
        }
        now_snake = [
            new_snake[0], new_snake[1], new_snake[2], new_snake[3], new_snake[4], new_snake[5], new_snake[6], new_snake[7]
        ];
        if (turn > 200) {
            return -3;
        }
        turn += 1;
    }
}

// Test cases
// 测试直接吃到食物（正前方）
assert.strictEqual(greedy_snake_fn_checker([5,5,5,4,5,3,5,2], [5,6]), 1, true);

// 测试角落导航（右下角到左上角）
assert.strictEqual(greedy_snake_fn_checker([8,8,8,7,7,7,7,8], [1,1]), 14, true);

// 测试环形身体阻挡路径
assert.strictEqual(greedy_snake_fn_checker([3,3,3,4,2,4,2,3], [5,5]), 4, true);

// 测试垂直方向长蛇绕行
assert.strictEqual(greedy_snake_fn_checker([4,1,4,2,4,3,4,4], [4,8]), 9, true);

// 测试贴边移动（左侧墙壁）
assert.strictEqual(greedy_snake_fn_checker([1,4,2,4,3,4,4,4], [1,8]), 4, true);

// 测试L型身体导航
assert.strictEqual(greedy_snake_fn_checker([5,5,5,6,5,7,4,7], [3,3]), 4, true);

// 测试直角转弯逻辑
assert.strictEqual(greedy_snake_fn_checker([7,1,6,1,5,1,4,1], [8,2]), 2, true);
assert.strictEqual(greedy_snake_fn_checker([8,1,7,1,6,1,5,1], [8,2]), 1, true);

console.log("🎉 You have passed all the tests provided.");