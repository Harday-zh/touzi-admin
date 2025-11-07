import { Interpreter } from './src/utils/interpreter.js';

const interpreter = new Interpreter();

// 测试语句分割功能
const script = `
    var x = 10;
    var y = 20;
    var z = x + y * 2;
    print(z); // 输出50

    if (z > 30) {
      print("z大于30");
    } else {
      print("z小于等于30");
    }

    var count = 0;
    while (count < 5) {
      print(count);
      count = count + 1;
    }

    var name = "test";
    print("Hello " + name);
  `;

console.log('=== 测试语句分割 ===');
const cleanedScript = script
  .replace(/\/\*[\s\S]*?\*\//g, '') // 去除多行注释
  .replace(/\/\/.*$/gm, '') // 去除单行注释
  .trim();

console.log('清理后的脚本:');
console.log(cleanedScript);

console.log('\n分割后的语句:');
const statements = interpreter.splitStatements(cleanedScript);
statements.forEach((stmt, index) => {
  console.log(`\n语句${index + 1}: ${stmt}`);
});