// 自定义脚本语言解释器

// 词法分析器
function tokenize(code) {
  const tokens = [];
  const regex = /\s*(var|if|else|while|print|\d+|"[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*|==|!=|<=|>=|[+\-*/(){}=!<>;])\s*/g;
  let match;
  
  while ((match = regex.exec(code)) !== null) {
    if (match[1]) {
      tokens.push(match[1]);
    }
  }
  
  return tokens;
}

// 语法分析器 - 生成抽象语法树(AST)
function parse(tokens) {
  let current = 0;
  
  function walk() {
    let token = tokens[current];
    
    // 数字
    if (/^\d+$/.test(token)) {
      current++;
      return { type: 'Number', value: parseInt(token) };
    }
    
    // 字符串
    if (/^"[^"]*"$/.test(token)) {
      current++;
      return { type: 'String', value: token.slice(1, -1) };
    }
    
    // 括号表达式
    if (token === '(') {
      current++;
      const expr = walk();
      if (tokens[current] !== ')') {
        throw new Error('Expected )');
      }
      current++;
      return expr;
    }
    
    // 二元表达式
    if (['+', '-', '*', '/', '==', '!=', '<', '>', '<=', '>='].includes(token)) {
      const operator = token;
      current++;
      return { type: 'BinaryExpr', operator, left: walk(), right: walk() };
    }
    
    // 变量
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
      current++;
      return { type: 'Identifier', name: token };
    }
    
    throw new Error('Unexpected token: ' + token);
  }
  
  const ast = [];
  while (current < tokens.length) {
    ast.push(statement());
  }
  
  function statement() {
    let token = tokens[current];
    
    // 变量赋值
    if (token === 'var') {
      current++;
      const name = tokens[current];
      current++;
      if (tokens[current] !== '=') {
        throw new Error('Expected =');
      }
      current++;
      const value = walk();
      if (tokens[current] !== ';') {
        throw new Error('Expected ;');
      }
      current++;
      return { type: 'VarDecl', name, value };
    }
    
    // 输出语句
    if (token === 'print') {
      current++;
      if (tokens[current] !== '(') {
        throw new Error('Expected (');
      }
      current++;
      const expr = walk();
      if (tokens[current] !== ')') {
        throw new Error('Expected )');
      }
      current++;
      if (tokens[current] !== ';') {
        throw new Error('Expected ;');
      }
      current++;
      return { type: 'PrintStmt', expr };
    }
    
    // if语句
    if (token === 'if') {
      current++;
      if (tokens[current] !== '(') {
        throw new Error('Expected (');
      }
      current++;
      const condition = walk();
      if (tokens[current] !== ')') {
        throw new Error('Expected )');
      }
      current++;
      if (tokens[current] !== '{') {
        throw new Error('Expected {');
      }
      current++;
      const consequent = [];
      while (tokens[current] !== '}') {
        consequent.push(statement());
      }
      current++;
      let alternate = null;
      if (tokens[current] === 'else') {
        current++;
        if (tokens[current] !== '{') {
          throw new Error('Expected {');
        }
        current++;
        alternate = [];
        while (tokens[current] !== '}') {
          alternate.push(statement());
        }
        current++;
      }
      return { type: 'IfStmt', condition, consequent, alternate };
    }
    
    // while循环
    if (token === 'while') {
      current++;
      if (tokens[current] !== '(') {
        throw new Error('Expected (');
      }
      current++;
      const condition = walk();
      if (tokens[current] !== ')') {
        throw new Error('Expected )');
      }
      current++;
      if (tokens[current] !== '{') {
        throw new Error('Expected {');
      }
      current++;
      const body = [];
      while (current < tokens.length && tokens[current] !== '}') {
        body.push(statement());
      }
      if (current >= tokens.length) {
        throw new Error('Expected }');
      }
      current++;
      return { type: 'WhileStmt', condition, body };
    }
    
    throw new Error('Unexpected statement: ' + token);
  }
  
  return ast;
}

// 执行器
function evaluate(ast, env = {}) {
  for (const node of ast) {
    evaluateNode(node, env);
  }
  return env;
}

function evaluateNode(node, env) {
  switch (node.type) {
    case 'Number':
      return node.value;
    
    case 'String':
      return node.value;
    
    case 'Identifier':
      if (!(node.name in env)) {
        throw new Error('Undefined variable: ' + node.name);
      }
      return env[node.name];
    
    case 'BinaryExpr':
      const left = evaluateNode(node.left, env);
      const right = evaluateNode(node.right, env);
      switch (node.operator) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '==': return left === right;
        case '!=': return left !== right;
        case '<': return left < right;
        case '>': return left > right;
        case '<=': return left <= right;
        case '>=': return left >= right;
        default: throw new Error('Unknown operator: ' + node.operator);
      }
    
    case 'VarDecl':
      env[node.name] = evaluateNode(node.value, env);
      return env[node.name];
    
    case 'PrintStmt':
      const value = evaluateNode(node.expr, env);
      console.log(value);
      return value;
    
    case 'IfStmt':
      if (evaluateNode(node.condition, env)) {
        for (const stmt of node.consequent) {
          evaluateNode(stmt, env);
        }
      } else if (node.alternate) {
        for (const stmt of node.alternate) {
          evaluateNode(stmt, env);
        }
      }
      return;
    
    case 'WhileStmt':
      while (evaluateNode(node.condition, env)) {
        for (const stmt of node.body) {
          evaluateNode(stmt, env);
        }
      }
      return;
    
    default:
      throw new Error('Unknown node type: ' + node.type);
  }
}

// 解释器主函数
export function interpret(code) {
  const tokens = tokenize(code);
  const ast = parse(tokens);
  return evaluate(ast);
}