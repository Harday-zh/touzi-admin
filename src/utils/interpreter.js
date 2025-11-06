/**
 * 自定义脚本语言解释器
 * 支持：变量赋值、算术运算、条件语句、循环、比较操作、输出语句
 */

class Interpreter {
  constructor() {
    this.variables = {}; // 变量存储
    this.output = []; // 输出缓存
  }

  /**
   * 执行脚本
   * @param {string} script - 脚本代码
   * @returns {object} - 包含执行结果的对象
   */
  execute(script) {
    this.output = [];
    // 预处理：移除多余的空白字符和注释
    const lines = script.trim().split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'));
    let i = 0;
    
    // 执行每条语句
    while (i < lines.length) {
      const line = lines[i];
      
      if (line.startsWith('var ')) {
        // 变量赋值语句
        this._executeVarAssignment(line);
      } else if (line.startsWith('print(')) {
        // 输出语句
        this._executePrint(line);
      } else if (line.startsWith('if ')) {
        // 条件语句 - 注意：这里不需要i++，因为_executeIf会返回新的索引
        i = this._executeIf(lines, i);
        continue;
      } else if (line.startsWith('while ')) {
        // 循环语句 - 注意：这里不需要i++，因为_executeWhile会返回新的索引
        i = this._executeWhile(lines, i);
        continue;
      }
      
      i++;
    }

    return {
      variables: { ...this.variables },
      output: [...this.output]
    };
  }

  /**
   * 执行变量赋值
   */
  _executeVarAssignment(line) {
    // 解析：var x = 10;
    const match = line.match(/^var\s+(\w+)\s*=\s*(.*);$/);
    if (match) {
      const [, varName, expression] = match;
      const value = this._evaluateExpression(expression);
      this.variables[varName] = value;
    }
  }

  /**
   * 执行输出语句
   */
  _executePrint(line) {
    // 解析：print(expression);
    const match = line.match(/^print\((.*)\);$/);
    if (match) {
      const [, expression] = match;
      const value = this._evaluateExpression(expression);
      this.output.push(value);
    }
  }

  /**
   * 执行条件语句
   */
  _executeIf(lines, startIndex) {
    // 解析条件
    const conditionLine = lines[startIndex];
    const conditionMatch = conditionLine.match(/^if\s+\((.*)\)\s*\{?$/);
    if (!conditionMatch) return startIndex;
    
    const [, condition] = conditionMatch;
    
    // 解析代码块结构
    let i = startIndex;
    let ifBody = [];
    let elseBody = [];
    let hasElse = false;
    let inElse = false;
    let braceCount = conditionLine.includes('{') ? 1 : 0;
    
    // 收集if和else块的内容
    i++;
    while (i < lines.length && (braceCount > 0 || !hasElse)) {
      const line = lines[i];
      
      if (!inElse && line.trim() === 'else') {
        hasElse = true;
        inElse = true;
        braceCount = line.includes('{') ? 1 : 0;
      } else if (inElse || braceCount > 0) {
        // 处理花括号
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
        
        // 只收集非花括号的实际代码行
        if (line.trim() !== '{' && line.trim() !== '}' && line.trim() !== 'else') {
          if (inElse) {
            elseBody.push(line);
          } else {
            ifBody.push(line);
          }
        }
        
        // 如果没有花括号包围，单行就是整个块
        if (braceCount === 0 && !line.includes('{') && !hasElse) {
          break;
        }
      }
      
      i++;
    }
    
    const conditionValue = this._evaluateExpression(condition);
    
    // 执行相应的代码块
    if (conditionValue) {
      // 执行if块
      for (const stmt of ifBody) {
        const tempInterpreter = new Interpreter();
        tempInterpreter.variables = { ...this.variables };
        tempInterpreter.execute(stmt);
        this.variables = { ...tempInterpreter.variables };
        this.output = [...this.output, ...tempInterpreter.output];
      }
    } else if (hasElse) {
      // 执行else块
      for (const stmt of elseBody) {
        const tempInterpreter = new Interpreter();
        tempInterpreter.variables = { ...this.variables };
        tempInterpreter.execute(stmt);
        this.variables = { ...tempInterpreter.variables };
        this.output = [...this.output, ...tempInterpreter.output];
      }
    }
    
    return i - 1; // 返回处理到的最后一行索引
  }

  /**
   * 执行循环语句
   */
  _executeWhile(lines, startIndex) {
    // 解析条件
    const conditionLine = lines[startIndex];
    const conditionMatch = conditionLine.match(/^while\s+\((.*)\)\s*\{?$/);
    if (!conditionMatch) return startIndex;
    
    const [, condition] = conditionMatch;
    
    // 解析循环体
    let i = startIndex;
    let loopBody = [];
    let braceCount = conditionLine.includes('{') ? 1 : 0;
    
    i++;
    while (i < lines.length && braceCount > 0) {
      const line = lines[i];
      
      // 处理花括号
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      // 收集循环体内容（排除花括号）
      if (line.trim() !== '{' && line.trim() !== '}') {
        loopBody.push(line);
      }
      
      // 单行循环体
      if (braceCount === 0 && !line.includes('{')) {
        break;
      }
      
      i++;
    }
    
    const loopEndIndex = i - 1;
    
    // 执行循环
    while (this._evaluateExpression(condition)) {
      const tempInterpreter = new Interpreter();
      tempInterpreter.variables = { ...this.variables };
      tempInterpreter.execute(loopBody.join('\n'));
      this.variables = { ...tempInterpreter.variables };
      this.output = [...this.output, ...tempInterpreter.output];
      
      // 防止无限循环的安全措施
      if (Object.keys(this.variables).includes('__break')) {
        delete this.variables.__break;
        break;
      }
    }
    
    return loopEndIndex;
  }

  /**
   * 表达式求值
   */
  _evaluateExpression(expression) {
    expression = expression.trim();
    
    // 处理括号表达式（优先级最高）
    if (expression.startsWith('(') && expression.endsWith(')')) {
      // 检查是否是最外层括号
      let depth = 0;
      let hasInnerBrackets = false;
      for (let i = 1; i < expression.length - 1; i++) {
        if (expression[i] === '(') depth++;
        if (expression[i] === ')') depth--;
        if (depth < 0) break; // 不匹配的括号
      }
      // 如果括号匹配正确，并且是最外层括号，则递归求值
      if (depth === 0) {
        return this._evaluateExpression(expression.substring(1, expression.length - 1));
      }
    }
    
    // 处理字符串字面量
    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.substring(1, expression.length - 1);
    }
    
    // 处理数字字面量
    if (!isNaN(expression) && expression !== '') {
      return Number(expression);
    }
    
    // 处理变量引用
    if (/^\w+$/.test(expression)) {
      return this.variables[expression] || 0;
    }
    
    // 处理逻辑操作（优先级较低）
    // 处理逻辑与操作 &&
    const andParts = this._splitExpression(expression, '&&');
    if (andParts.length === 2) {
      const left = this._evaluateExpression(andParts[0]);
      const right = this._evaluateExpression(andParts[1]);
      return left && right;
    }
    
    // 处理逻辑或操作 ||
    const orParts = this._splitExpression(expression, '||');
    if (orParts.length === 2) {
      const left = this._evaluateExpression(orParts[0]);
      const right = this._evaluateExpression(orParts[1]);
      return left || right;
    }
    
    // 处理比较操作
    const comparisonOps = ['==', '!=', '<=', '>=', '<', '>'];
    for (const op of comparisonOps) {
      const parts = this._splitExpression(expression, op);
      if (parts.length === 2) {
        const left = this._evaluateExpression(parts[0]);
        const right = this._evaluateExpression(parts[1]);
        
        switch (op) {
          case '==': return left == right;
          case '!=': return left != right;
          case '<': return left < right;
          case '>': return left > right;
          case '<=': return left <= right;
          case '>=': return left >= right;
        }
      }
    }
    
    // 处理加法（可能是字符串连接或数字加法）
    const addParts = this._splitExpression(expression, '+');
    if (addParts.length === 2) {
      const left = this._evaluateExpression(addParts[0]);
      const right = this._evaluateExpression(addParts[1]);
      return left + right;
    }
    
    // 处理减法
    const subtractParts = this._splitExpression(expression, '-');
    if (subtractParts.length === 2) {
      const left = this._evaluateExpression(subtractParts[0]);
      const right = this._evaluateExpression(subtractParts[1]);
      return left - right;
    }
    
    // 处理乘法
    const multiplyParts = this._splitExpression(expression, '*');
    if (multiplyParts.length === 2) {
      const left = this._evaluateExpression(multiplyParts[0]);
      const right = this._evaluateExpression(multiplyParts[1]);
      return left * right;
    }
    
    // 处理除法
    const divideParts = this._splitExpression(expression, '/');
    if (divideParts.length === 2) {
      const left = this._evaluateExpression(divideParts[0]);
      const right = this._evaluateExpression(divideParts[1]);
      return right !== 0 ? left / right : 0; // 避免除零错误
    }
    
    return 0; // 默认返回值
  }

  /**
   * 分割表达式，考虑括号嵌套
   */
  _splitExpression(expression, operator) {
    let depth = 0;
    let splitIndex = -1;
    
    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === '(') depth++;
      if (expression[i] === ')') depth--;
      
      // 只在最外层括号级别分割
      if (depth === 0 && expression.substring(i, i + operator.length) === operator) {
        splitIndex = i;
        break;
      }
    }
    
    if (splitIndex === -1) return [expression];
    
    return [
      expression.substring(0, splitIndex).trim(),
      expression.substring(splitIndex + operator.length).trim()
    ];
  }
}

// CommonJS导出
module.exports = {
  default: Interpreter,
  Interpreter,
  runScriptExample: function() {
    const interpreter = new Interpreter();
    const script = `
      var x = 10;
      var y = 5;
      var z = x + y;
      print(z);
      
      if (z > 10) {
        print("z 大于 10");
      } else {
        print("z 小于等于 10");
      }
      
      var i = 0;
      while (i < 3) {
        print(i);
        var i = i + 1;
      }
      
      var name = "解释器";
      print("Hello " + name);
    `;
    
    return interpreter.execute(script);
  }
};

// 为了同时支持ES模块导入（在Vite等环境中）
if (typeof window !== 'undefined' && typeof window.exports === 'undefined') {
  window.Interpreter = Interpreter;
}