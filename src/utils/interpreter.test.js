/**
 * 解释器测试文件
 */

// 使用CommonJS语法
const Interpreter = require('./interpreter.js').default;

// 测试解释器功能
function testInterpreter() {
  console.log('开始测试解释器功能...');
  
  // 测试场景1：变量赋值和算术运算
  function testVariablesAndArithmetic() {
    console.log('\n测试1: 变量赋值和算术运算');
    const interpreter = new Interpreter();
    const script = `
      var x = 10;
      var y = 5;
      var sum = x + y;
      var difference = x - y;
      var product = x * y;
      var quotient = x / y;
      print(sum);
      print(difference);
      print(product);
      print(quotient);
    `;
    
    const result = interpreter.execute(script);
    console.log('输出:', result.output);
    console.log('变量:', result.variables);
  }

  // 测试场景2：条件语句
  function testConditionals() {
    console.log('\n测试2: 条件语句');
    const interpreter = new Interpreter();
    const script = `
      var a = 15;
      var b = 10;
      
      if (a > b) {
        print("a 大于 b");
      } else {
        print("a 小于等于 b");
      }
      
      if (a == b) {
        print("a 等于 b");
      } else {
        print("a 不等于 b");
      }
    `;
    
    const result = interpreter.execute(script);
    console.log('输出:', result.output);
  }

  // 测试场景3：循环
  function testLoops() {
    console.log('\n测试3: 循环');
    const interpreter = new Interpreter();
    const script = `
      var i = 0;
      var sum = 0;
      while (i < 5) {
        print(i);
        var sum = sum + i;
        var i = i + 1;
      }
      print("总和: " + sum);
    `;
    
    const result = interpreter.execute(script);
    console.log('输出:', result.output);
  }

  // 测试场景4：字符串处理
  function testStrings() {
    console.log('\n测试4: 字符串处理');
    const interpreter = new Interpreter();
    const script = `
      var name = "解释器";
      var greeting = "Hello " + name;
      print(greeting);
      print("测试字符串连接");
    `;
    
    const result = interpreter.execute(script);
    console.log('输出:', result.output);
  }

  // 测试场景5：复合表达式和括号
  function testComplexExpressions() {
    console.log('\n测试5: 复合表达式和括号');
    const interpreter = new Interpreter();
    const script = `
      var result = (10 + 5) * 2 - 8 / 4;
      print(result);
      
      var condition = (10 > 5) && (20 < 25);
      if (condition) {
        print("复杂条件为真");
      }
    `;
    
    const result = interpreter.execute(script);
    console.log('输出:', result.output);
  }

  // 运行所有测试
  testVariablesAndArithmetic();
  testConditionals();
  testLoops();
  testStrings();
  testComplexExpressions();
  
  console.log('\n解释器测试完成！');
}

// 如果直接运行此文件
testInterpreter();

// 导出测试函数
module.exports = { testInterpreter };