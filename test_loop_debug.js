import { Interpreter } from './src/utils/interpreter.js';

const interpreter = new Interpreter();

const script = 'while (count < 5) { print(count); count = count + 1; }';

console.log('=== 调试循环语句执行 ===');
console.log('脚本:', script);

// 手动调用executeWhile方法
interpreter.variables.count = 0;

// 调试findMatchingParenthesis方法
const conditionEnd = interpreter.findMatchingParenthesis(script, 6);
console.log('条件结束位置:', conditionEnd);
console.log('条件表达式:', script.slice(6, conditionEnd).trim());

// 调试findMatchingBrace方法
let blockStart = conditionEnd + 1;
while (blockStart < script.length && script[blockStart] !== '{') {
  blockStart++;
}
console.log('循环块开始位置:', blockStart);

const blockEnd = interpreter.findMatchingBrace(script, blockStart);
console.log('循环块结束位置:', blockEnd);
console.log('循环块内容:', script.slice(blockStart + 1, blockEnd).trim());