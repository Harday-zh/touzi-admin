/**
 * 无限异步递归生成器 - 分形数据结构实现
 * 使用Proxy动态生成节点，支持异步迭代遍历
 */

// 导入解释器模块（使用CommonJS语法）
const interpreterModule = require('./interpreter.js');
const Interpreter = interpreterModule.default || interpreterModule.Interpreter;
const runScriptExample = interpreterModule.runScriptExample;

// 导入成绩管理模块
const gradeManagerModule = require('./gradeManager.js');
const Student = gradeManagerModule.Student;
const GradeManager = gradeManagerModule.GradeManager;

/**
 * 创建一个异步延迟函数，用于分割递归操作，避免栈溢出
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
const delay = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 创建分形树节点
 * @param {Array<string>} path - 当前节点的路径
 * @returns {Proxy} - 返回代理对象，实现动态属性访问
 */
const createTreeNode = (path = []) => {
  // 基础节点数据
  const node = {
    // 获取当前节点路径的方法
    getPath: () => [...path],
    
    // 获取当前节点名称
    getName: () => path.length > 0 ? path[path.length - 1] : 'root',
    
    // 异步生成器方法，用于遍历当前节点的子节点
    async *[Symbol.asyncIterator]() {
      // 模拟异步操作，分割递归
      await delay(0);
      
      // 这里可以根据需要生成子节点
      // 为了演示，我们生成几个示例子节点
      const sampleChildren = ['child1', 'child2', 'child3'];
      
      for (const childName of sampleChildren) {
        // 异步生成子节点
        await delay(0);
        yield this[childName];
      }
    }
  };
  
  // 创建Proxy，拦截属性访问
  return new Proxy(node, {
    get: (target, property) => {
      // 如果是Symbol或已存在的属性，直接返回
      if (typeof property === 'symbol' || property in target) {
        return target[property];
      }
      
      // 动态创建子节点
      const childPath = [...path, String(property)];
      return createTreeNode(childPath);
    },
    
    // 防止属性被意外设置
    set: () => {
      console.warn('分形树节点是只读的，不能设置属性');
      return false;
    }
  });
};

/**
 * 创建根分形树
 * @returns {Proxy} - 根节点代理
 */
const createFractalTree = () => {
  return createTreeNode([]);
};

/**
 * 异步深度优先遍历函数
 * @param {Proxy} node - 起始节点
 * @param {number} maxDepth - 最大遍历深度，防止无限递归
 * @param {number} currentDepth - 当前深度
 * @returns {AsyncGenerator} - 遍历生成器
 */
async function* traverseTree(node, maxDepth = 5, currentDepth = 0) {
  // 如果达到最大深度，停止递归
  if (currentDepth >= maxDepth) {
    return;
  }
  
  // 模拟异步操作，分割递归
  await delay(0);
  
  // 生成当前节点
  yield {
    node,
    path: node.getPath(),
    depth: currentDepth
  };
  
  // 异步遍历子节点
  for await (const child of node) {
    // 递归遍历子节点
    yield* traverseTree(child, maxDepth, currentDepth + 1);
  }
}

/**
 * 打印树结构的辅助函数
 * @param {Proxy} node - 要打印的节点
 * @param {number} maxDepth - 最大打印深度
 */
const printTree = async (node, maxDepth = 3) => {
  for await (const { path, depth } of traverseTree(node, maxDepth)) {
    const indent = '  '.repeat(depth);
    const nodeName = path.length > 0 ? path[path.length - 1] : 'root';
    console.log(`${indent}${nodeName}`);
  }
};

/**
 * 获取树中特定路径的节点
 * @param {Proxy} root - 根节点
 * @param {Array<string>} path - 要查找的路径
 * @returns {Proxy} - 路径对应的节点
 */
const getNodeByPath = (root, path) => {
  let current = root;
  for (const segment of path) {
    current = current[segment];
  }
  return current;
};

/**
 * 异步广度优先遍历函数
 * @param {Proxy} root - 根节点
 * @param {number} maxDepth - 最大遍历深度
 * @returns {AsyncGenerator} - 遍历生成器
 */
async function* breadthFirstTraverse(root, maxDepth = 5) {
  const queue = [{ node: root, depth: 0 }];
  
  while (queue.length > 0) {
    // 模拟异步操作
    await delay(0);
    
    const { node, depth } = queue.shift();
    
    // 生成当前节点
    yield {
      node,
      path: node.getPath(),
      depth
    };
    
    // 如果未达到最大深度，添加子节点到队列
    if (depth < maxDepth) {
      // 收集子节点
      const children = [];
      for await (const child of node) {
        children.push({ node: child, depth: depth + 1 });
      }
      
      // 将子节点添加到队列末尾
      queue.push(...children);
    }
  }
};

// CommonJS导出
module.exports = {
  createFractalTree,
  Interpreter,
  runScriptExample,
  Student,
  GradeManager,
  traverseTree,
  printTree,
  getNodeByPath,
  breadthFirstTraverse
};

// 浏览器环境支持
if (typeof window !== 'undefined') {
  window.utils = window.utils || {};
  Object.assign(window.utils, module.exports);
}