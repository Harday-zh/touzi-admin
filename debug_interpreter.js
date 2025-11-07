import { Interpreter } from './src/utils/interpreter.js';

console.log('=== 调试自定义脚本语言解释器 ===');

const interpreter = new Interpreter();

// 测试变量赋值和算术运算
console.log('\n1. 测试变量赋值和算术运算:');
interpreter.run('var x = 10; var y = 20; var z = x + y * 2; print(z);');

// 测试条件语句
console.log('\n2. 测试条件语句:');
interpreter.run('if (z > 30) { print("z大于30"); } else { print("z小于等于30"); }');

// 测试循环语句
console.log('\n3. 测试循环语句:');
interpreter.run('var count = 0; while (count < 5) { print(count); count = count + 1; }');

// 测试字符串
console.log('\n4. 测试字符串:');
interpreter.run('var name = "test"; print("Hello " + name);');