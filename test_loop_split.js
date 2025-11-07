import { Interpreter } from './src/utils/interpreter.js';

const interpreter = new Interpreter();

const script = 'var count = 0; while (count < 5) { print(count); count = count + 1; }';

console.log('=== 测试循环语句分割 ===');
console.log('脚本:', script);

const statements = interpreter.splitStatements(script);
console.log('分割后的语句数量:', statements.length);

statements.forEach((stmt, index) => {
  console.log(`\n语句${index + 1}: ${stmt}`);
  console.log('语句类型:', stmt.startsWith('while') ? '循环语句' : '其他');
});