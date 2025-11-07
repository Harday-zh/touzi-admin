import { Interpreter } from './src/utils/interpreter.js';

console.log('=== 测试循环语句 ===');

const interpreter = new Interpreter();

// 测试简单循环
interpreter.run('var count = 0; while (count < 5) { print(count); count = count + 1; }');