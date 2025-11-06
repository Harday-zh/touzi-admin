/**
 * 成绩管理系统测试文件
 */

const { Student, GradeManager } = require('./gradeManager.js');

// 测试成绩管理系统
function testGradeSystem() {
  console.log('开始测试成绩管理系统...');
  
  // 测试场景1：学生类基本功能
  function testStudent() {
    console.log('\n测试1: 学生类基本功能');
    
    try {
      // 创建学生对象
      const student = new Student('001', '张三');
      console.log('创建学生成功:', student.name);
      
      // 添加成绩
      student.addGrade('数学', 95);
      student.addGrade('语文', 88);
      student.addGrade('英语', 92);
      console.log('添加成绩成功');
      
      // 计算总分和平均分
      console.log('总分:', student.calculateTotal());
      console.log('平均分:', student.calculateAverage());
      
      // 显示学生信息
      console.log('学生信息:', student.displayInfo());
    } catch (error) {
      console.error('学生类测试失败:', error.message);
    }
  }

  // 测试场景2：成绩管理类基本功能
  function testGradeManager() {
    console.log('\n测试2: 成绩管理类基本功能');
    
    try {
      const manager = new GradeManager();
      
      // 添加学生
      const student1 = new Student('001', '张三');
      const student2 = new Student('002', '李四');
      const student3 = new Student('003', '王五');
      
      manager.addStudent(student1);
      manager.addStudent(student2);
      manager.addStudent(student3);
      console.log('添加学生成功，当前学生数量:', manager.students.length);
      
      // 录入成绩
      manager.enterGrade('001', '数学', 95);
      manager.enterGrade('001', '语文', 88);
      manager.enterGrade('001', '英语', 92);
      
      manager.enterGrade('002', '数学', 85);
      manager.enterGrade('002', '语文', 90);
      manager.enterGrade('002', '英语', 87);
      
      manager.enterGrade('003', '数学', 98);
      manager.enterGrade('003', '语文', 95);
      manager.enterGrade('003', '英语', 96);
      
      console.log('录入成绩成功');
      
      // 查找学生
      const foundStudent = manager.findStudentById('002');
      console.log('查找学生成功:', foundStudent ? foundStudent.name : '未找到');
      
      // 计算班级平均分
      console.log('班级平均分:', manager.calculateClassAverage());
      
      // 获取成绩最好的学生
      const topStudent = manager.getTopStudent();
      console.log('成绩最好的学生:', topStudent.name, '总分:', topStudent.calculateTotal());
    } catch (error) {
      console.error('成绩管理类测试失败:', error.message);
    }
  }

  // 测试场景3：排序和统计功能
  function testSortingAndStatistics() {
    console.log('\n测试3: 排序和统计功能');
    
    try {
      const manager = new GradeManager();
      
      // 添加测试数据
      const students = [
        new Student('001', '张三'),
        new Student('002', '李四'),
        new Student('003', '王五'),
        new Student('004', '赵六')
      ];
      
      students.forEach(student => manager.addStudent(student));
      
      // 录入成绩
      manager.enterGrade('001', '数学', 95).enterGrade('001', '语文', 88);
      manager.enterGrade('002', '数学', 85).enterGrade('002', '语文', 90);
      manager.enterGrade('003', '数学', 98).enterGrade('003', '语文', 95);
      manager.enterGrade('004', '数学', 88).enterGrade('004', '语文', 82);
      
      // 按总分排序
      const sortedStudents = manager.sortByTotalScore();
      console.log('按总分降序排序:');
      sortedStudents.forEach(student => {
        console.log(`${student.name}: ${student.calculateTotal()}`);
      });
      
      // 获取科目统计信息
      const mathStats = manager.getSubjectStatistics('数学');
      console.log('\n数学科目统计:');
      console.log(mathStats);
    } catch (error) {
      console.error('排序和统计测试失败:', error.message);
    }
  }

  // 测试场景4：显示所有学生信息
  function testDisplayAllStudents() {
    console.log('\n测试4: 显示所有学生信息');
    
    try {
      const manager = new GradeManager();
      
      // 创建完整的测试数据集
      const student1 = new Student('001', '张三');
      student1.addGrade('数学', 95);
      student1.addGrade('语文', 88);
      student1.addGrade('英语', 92);
      
      const student2 = new Student('002', '李四');
      student2.addGrade('数学', 85);
      student2.addGrade('语文', 90);
      student2.addGrade('英语', 87);
      
      const student3 = new Student('003', '王五');
      student3.addGrade('数学', 98);
      student3.addGrade('语文', 95);
      student3.addGrade('英语', 96);
      
      manager.addStudent(student1);
      manager.addStudent(student2);
      manager.addStudent(student3);
      
      // 显示所有学生信息
      console.log(manager.displayAllStudents());
    } catch (error) {
      console.error('显示学生信息测试失败:', error.message);
    }
  }

  // 测试场景5：错误处理
  function testErrorHandling() {
    console.log('\n测试5: 错误处理');
    
    try {
      const manager = new GradeManager();
      
      // 测试重复添加学生
      const student = new Student('001', '张三');
      manager.addStudent(student);
      
      try {
        manager.addStudent(student);
        console.log('错误：应该检测到重复添加');
      } catch (error) {
        console.log('正确捕获错误:', error.message);
      }
      
      // 测试查找不存在的学生
      try {
        manager.enterGrade('999', '数学', 90);
        console.log('错误：应该检测到学生不存在');
      } catch (error) {
        console.log('正确捕获错误:', error.message);
      }
      
      // 测试无效分数
      try {
        student.addGrade('数学', 101);
        console.log('错误：应该检测到无效分数');
      } catch (error) {
        console.log('正确捕获错误:', error.message);
      }
    } catch (error) {
      console.error('错误处理测试失败:', error.message);
    }
  }

  // 运行所有测试
  testStudent();
  testGradeManager();
  testSortingAndStatistics();
  testDisplayAllStudents();
  testErrorHandling();
  
  console.log('\n成绩管理系统测试完成！');
}

// 如果直接运行此文件
testGradeSystem();

// 导出测试函数
module.exports = { testGradeSystem };