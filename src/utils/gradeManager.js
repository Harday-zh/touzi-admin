/**
 * 成绩管理系统
 * 包含Student类和GradeManager类
 */

/**
 * 学生类
 * 包含学号、姓名和成绩信息
 */
class Student {
  /**
   * 构造函数
   * @param {string|number} id - 学号
   * @param {string} name - 姓名
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.grades = {}; // 成绩对象，格式：{科目名: 分数}
  }

  /**
   * 添加成绩
   * @param {string} subject - 科目名称
   * @param {number} score - 分数
   */
  addGrade(subject, score) {
    if (typeof score !== 'number' || score < 0 || score > 100) {
      throw new Error('分数必须是0-100之间的数字');
    }
    this.grades[subject] = score;
  }

  /**
   * 计算平均分
   * @returns {number} 平均分
   */
  calculateAverage() {
    const subjects = Object.keys(this.grades);
    if (subjects.length === 0) {
      return 0;
    }
    
    const total = subjects.reduce((sum, subject) => sum + this.grades[subject], 0);
    return total / subjects.length;
  }

  /**
   * 计算总分
   * @returns {number} 总分
   */
  calculateTotal() {
    return Object.values(this.grades).reduce((sum, score) => sum + score, 0);
  }

  /**
   * 获取学生信息
   * @returns {object} 学生信息对象
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      grades: { ...this.grades },
      totalScore: this.calculateTotal(),
      averageScore: this.calculateAverage()
    };
  }

  /**
   * 显示学生信息
   * @returns {string} 格式化的学生信息
   */
  displayInfo() {
    const info = this.getInfo();
    const gradesStr = Object.entries(info.grades)
      .map(([subject, score]) => `${subject}: ${score}`)
      .join(', ');
    
    return `学号: ${info.id}, 姓名: ${info.name}, 成绩: [${gradesStr}], 总分: ${info.totalScore}, 平均分: ${info.averageScore.toFixed(2)}`;
  }
}

/**
 * 成绩管理类
 * 管理多个学生的成绩信息
 */
class GradeManager {
  constructor() {
    this.students = []; // 存储所有学生对象
  }

  /**
   * 添加学生
   * @param {Student} student - 学生对象
   * @returns {GradeManager} 返回this以支持链式调用
   */
  addStudent(student) {
    if (!(student instanceof Student)) {
      throw new Error('只能添加Student类型的对象');
    }
    
    // 检查学号是否已存在
    if (this.findStudentById(student.id)) {
      throw new Error(`学号 ${student.id} 已存在`);
    }
    
    this.students.push(student);
    return this;
  }

  /**
   * 根据学号查找学生
   * @param {string|number} id - 学号
   * @returns {Student|null} 找到的学生对象，未找到返回null
   */
  findStudentById(id) {
    return this.students.find(student => student.id === id) || null;
  }

  /**
   * 录入学生成绩
   * @param {string|number} studentId - 学生学号
   * @param {string} subject - 科目
   * @param {number} score - 分数
   * @returns {GradeManager} 返回this以支持链式调用
   */
  enterGrade(studentId, subject, score) {
    const student = this.findStudentById(studentId);
    if (!student) {
      throw new Error(`未找到学号为 ${studentId} 的学生`);
    }
    
    student.addGrade(subject, score);
    return this;
  }

  /**
   * 计算班级平均分
   * @returns {number} 班级平均分
   */
  calculateClassAverage() {
    if (this.students.length === 0) {
      return 0;
    }
    
    const totalAverage = this.students.reduce((sum, student) => sum + student.calculateAverage(), 0);
    return totalAverage / this.students.length;
  }

  /**
   * 按总分排序学生
   * @param {boolean} ascending - 是否升序排列，默认降序
   * @returns {Array<Student>} 排序后的学生数组
   */
  sortByTotalScore(ascending = false) {
    return [...this.students].sort((a, b) => {
      const scoreA = a.calculateTotal();
      const scoreB = b.calculateTotal();
      return ascending ? scoreA - scoreB : scoreB - scoreA;
    });
  }

  /**
   * 获取成绩最好的学生
   * @returns {Student|null} 成绩最好的学生，若没有学生返回null
   */
  getTopStudent() {
    if (this.students.length === 0) {
      return null;
    }
    
    return this.students.reduce((top, current) => {
      return current.calculateTotal() > top.calculateTotal() ? current : top;
    });
  }

  /**
   * 显示所有学生信息
   * @returns {string} 所有学生信息的字符串
   */
  displayAllStudents() {
    if (this.students.length === 0) {
      return '暂无学生信息';
    }
    
    const sortedStudents = this.sortByTotalScore();
    const header = `班级共有 ${this.students.length} 名学生，班级平均分: ${this.calculateClassAverage().toFixed(2)}\n`;
    const studentsInfo = sortedStudents.map(student => student.displayInfo()).join('\n');
    
    return header + studentsInfo;
  }

  /**
   * 获取所有学生信息
   * @returns {Array<object>} 所有学生信息对象数组
   */
  getAllStudentsInfo() {
    return this.students.map(student => student.getInfo());
  }

  /**
   * 根据科目获取成绩统计
   * @param {string} subject - 科目名称
   * @returns {object} 成绩统计信息
   */
  getSubjectStatistics(subject) {
    const scores = this.students
      .filter(student => subject in student.grades)
      .map(student => student.grades[subject]);
    
    if (scores.length === 0) {
      return { subject, count: 0, average: 0, highest: 0, lowest: 0 };
    }
    
    return {
      subject,
      count: scores.length,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      highest: Math.max(...scores),
      lowest: Math.min(...scores)
    };
  }
}

// 导出类
module.exports = {
  Student,
  GradeManager
};

// 如果在浏览器环境中，也挂载到window对象
try {
  if (typeof window !== 'undefined') {
    window.Student = Student;
    window.GradeManager = GradeManager;
  }
} catch (e) {
  // 忽略错误
}