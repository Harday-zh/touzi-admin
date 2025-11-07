/**
 * 自定义脚本语言解释器
 * 支持变量赋值、算术运算、条件语句、循环和输出
 */

class Interpreter {
  constructor() {
    this.variables = {}; // 存储变量
  }

  /**
   * 解析并执行脚本
   * @param {string} script - 要执行的脚本代码
   */
  run(script) {
    // 去除注释和空白
    const cleanedScript = script
      .replace(/\/\*[\s\S]*?\*\//g, '') // 去除多行注释
      .replace(/\/\/.*$/gm, '') // 去除单行注释
      .trim();

    if (!cleanedScript) return;

    // 按语句分割
    const statements = this.splitStatements(cleanedScript);

    // 执行每个语句
    for (const statement of statements) {
      if (statement.trim()) {
        this.executeStatement(statement.trim());
      }
    }
  }

  /**
   * 将脚本分割为语句
   * @param {string} script - 脚本代码
   * @returns {string[]} 语句数组
   */
  splitStatements(script) {
    const statements = [];
    let current = '';
    let depth = 0;
    let inString = false;
    let stringChar = '';

    for (const char of script) {
      if (char === '"' || char === "'") {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }

      if (inString) {
        current += char;
        continue;
      }

      if (char === '{' || char === '(') {
        depth++;
      } else if (char === '}' || char === ')') {
        depth--;
      }

      // 只在深度为0且遇到分号时分割语句
      if (char === ';' && depth === 0) {
        const stmt = current.trim();
        if (stmt) {
          statements.push(stmt);
        }
        current = '';
      } else {
        current += char;
      }
    }

    // 处理最后一个没有分号的语句
    const lastStmt = current.trim();
    if (lastStmt) {
      statements.push(lastStmt);
    }

    return statements;
  }

  /**
   * 执行单个语句
   * @param {string} statement - 要执行的语句
   */
  executeStatement(statement) {
    if (statement.startsWith('var ')) {
      // 变量赋值
      this.executeVarAssignment(statement);
    } else if (statement.startsWith('print(')) {
      // 输出语句
      this.executePrint(statement);
    } else if (statement.startsWith('if ')) {
      // 条件语句
      this.executeIf(statement);
    } else if (statement.startsWith('while ')) {
      // 循环语句
      this.executeWhile(statement);
    } else {
      // 表达式语句
      this.evaluate(statement);
    }
  }

  /**
   * 执行变量赋值语句
   * @param {string} statement - 赋值语句
   */
  executeVarAssignment(statement) {
    // 匹配 var x = 10
    const match = statement.match(/^var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/);
    if (match) {
      const [, varName, expression] = match;
      const value = this.evaluate(expression);
      this.variables[varName] = value;
    }
  }

  /**
   * 执行输出语句
   * @param {string} statement - 输出语句
   */
  executePrint(statement) {
    // 匹配 print(expression)
    const match = statement.match(/^print\((.*)\)$/);
    if (match) {
      const [, expression] = match;
      const value = this.evaluate(expression);
      console.log(value);
    }
  }

  /**
   * 执行条件语句
   * @param {string} statement - 条件语句
   */
  executeIf(statement) {
    // 找到条件结束位置
    const conditionEnd = this.findMatchingParenthesis(statement, 4); // 4是"if ("的长度
    if (conditionEnd === -1) return;

    const conditionExpr = statement.slice(4, conditionEnd).trim();
    const condition = this.evaluate(conditionExpr);

    // 找到if块开始位置
    let blockStart = conditionEnd + 1;
    while (blockStart < statement.length && statement[blockStart] !== '{') {
      blockStart++;
    }
    if (blockStart >= statement.length) return;

    // 找到if块结束位置
    const ifBlockEnd = this.findMatchingBrace(statement, blockStart);
    if (ifBlockEnd === -1) return;

    const ifBlock = statement.slice(blockStart + 1, ifBlockEnd).trim();

    if (condition) {
      this.run(ifBlock);
      return;
    }

    // 检查是否有else块
    let elseStart = ifBlockEnd + 1;
    while (elseStart < statement.length && statement[elseStart] !== 'e') {
      elseStart++;
    }

    if (elseStart < statement.length && statement.startsWith('else', elseStart)) {
      // 找到else块开始位置
      let elseBlockStart = elseStart + 4;
      while (elseBlockStart < statement.length && statement[elseBlockStart] !== '{') {
        elseBlockStart++;
      }
      if (elseBlockStart >= statement.length) return;

      // 找到else块结束位置
      const elseBlockEnd = this.findMatchingBrace(statement, elseBlockStart);
      if (elseBlockEnd === -1) return;

      const elseBlock = statement.slice(elseBlockStart + 1, elseBlockEnd).trim();
      this.run(elseBlock);
    }
  }

  /**
   * 执行循环语句
   * @param {string} statement - 循环语句
   */
  executeWhile(statement) {
    // 找到条件结束位置
    const conditionEnd = this.findMatchingParenthesis(statement, 6); // 6是"while ("的长度
    if (conditionEnd === -1) return;

    const conditionExpr = statement.slice(6, conditionEnd).trim();

    // 找到循环块开始位置
    let blockStart = conditionEnd + 1;
    while (blockStart < statement.length && statement[blockStart] !== '{') {
      blockStart++;
    }
    if (blockStart >= statement.length) return;

    // 找到循环块结束位置
    const blockEnd = this.findMatchingBrace(statement, blockStart);
    if (blockEnd === -1) return;

    const whileBlock = statement.slice(blockStart + 1, blockEnd).trim();

    while (this.evaluate(conditionExpr)) {
      this.run(whileBlock);
    }
  }

  /**
   * 找到匹配的括号
   * @param {string} str - 字符串
   * @param {number} start - 开始位置
   * @returns {number} 匹配的括号位置
   */
  findMatchingParenthesis(str, start) {
    let depth = 1;
    for (let i = start; i < str.length; i++) {
      const char = str[i];
      if (char === '(') depth++;
      if (char === ')') depth--;
      if (depth === 0) return i;
    }
    return -1;
  }

  /**
   * 找到匹配的大括号
   * @param {string} str - 字符串
   * @param {number} start - 开始位置
   * @returns {number} 匹配的大括号位置
   */
  findMatchingBrace(str, start) {
    let depth = 1;
    for (let i = start + 1; i < str.length; i++) {
      const char = str[i];
      if (char === '{') depth++;
      if (char === '}') depth--;
      if (depth === 0) return i;
    }
    return -1;
  }

  /**
   * 解析表达式
   * @param {string} expression - 表达式字符串
   * @returns {number|string|boolean} 表达式的值
   */
  evaluate(expression) {
    expression = expression.trim();

    // 处理字符串
    if ((expression.startsWith('"') && expression.endsWith('"')) || (expression.startsWith("'") && expression.endsWith("'"))) {
      return expression.slice(1, -1);
    }

    // 处理数字
    if (/^\d+$/.test(expression)) {
      return parseInt(expression);
    }

    // 处理变量
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expression)) {
      return this.variables[expression] !== undefined ? this.variables[expression] : 0;
    }

    // 处理比较操作
    const comparisonOperators = ['==', '!=', '<', '>', '<=', '>='];
    for (const op of comparisonOperators) {
      const index = expression.lastIndexOf(op);
      if (index !== -1) {
        const left = this.evaluate(expression.slice(0, index).trim());
        const right = this.evaluate(expression.slice(index + op.length).trim());

        switch (op) {
          case '==': return left === right;
          case '!=': return left !== right;
          case '<': return left < right;
          case '>': return left > right;
          case '<=': return left <= right;
          case '>=': return left >= right;
        }
      }
    }

    // 处理算术操作
    const arithmeticOperators = ['+', '-', '*', '/'];
    for (const op of arithmeticOperators) {
      const index = expression.lastIndexOf(op);
      if (index !== -1) {
        const left = this.evaluate(expression.slice(0, index).trim());
        const right = this.evaluate(expression.slice(index + op.length).trim());

        switch (op) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
        }
      }
    }

    // 处理括号
    if (expression.startsWith('(') && expression.endsWith(')')) {
      return this.evaluate(expression.slice(1, -1));
    }

    return 0;
  }
}

// 示例用法
function runScriptExample() {
  const interpreter = new Interpreter();
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
  interpreter.run(script);
}

// 导出模块
export { Interpreter, runScriptExample };