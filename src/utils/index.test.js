// 测试修复后的utils/index.js模块

// 导入utils模块
const utils = require('./index.js');

// 测试所有导出功能是否可用
console.log('测试utils/index.js模块导出...');

// 验证所有需要的函数和类都已导出
const requiredExports = [
  'createFractalTree',
  'Interpreter',
  'runScriptExample',
  'Student',
  'GradeManager',
  'traverseTree',
  'printTree',
  'getNodeByPath',
  'breadthFirstTraverse'
];

let allExportsFound = true;
for (const exportName of requiredExports) {
  if (utils[exportName] === undefined) {
    console.error(`❌ 未找到导出: ${exportName}`);
    allExportsFound = false;
  } else {
    console.log(`✅ 找到导出: ${exportName}`);
  }
}

// 简单测试createFractalTree功能
async function testFractalTree() {
  try {
    console.log('\n测试分形树功能...');
    const tree = utils.createFractalTree();
    const node = tree.child1.child2;
    console.log('节点路径:', node.getPath());
    console.log('节点名称:', node.getName());
    console.log('✅ 分形树功能正常');
    return true;
  } catch (error) {
    console.error('❌ 分形树功能测试失败:', error);
    return false;
  }
}

// 运行测试
async function runTests() {
  console.log('开始测试...');
  
  // 测试导出
  const exportsTestPassed = allExportsFound;
  
  // 测试分形树功能
  const fractalTreeTestPassed = await testFractalTree();
  
  // 输出总体结果
  console.log('\n===== 测试结果 =====');
  console.log(`导出测试: ${exportsTestPassed ? '通过' : '失败'}`);
  console.log(`分形树测试: ${fractalTreeTestPassed ? '通过' : '失败'}`);
  
  if (exportsTestPassed && fractalTreeTestPassed) {
    console.log('🎉 所有测试通过! utils/index.js文件修复成功。');
    process.exit(0);
  } else {
    console.log('❌ 测试失败，请检查错误。');
    process.exit(1);
  }
}

// 执行测试
runTests().catch(error => {
  console.error('测试执行出错:', error);
  process.exit(1);
});