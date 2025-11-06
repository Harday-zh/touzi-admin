import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1>关于 To-Do List 应用</h1>
      <div className="about-content">
        <p>这是一个简单的待办事项管理应用，帮助您跟踪和管理日常任务。</p>
        
        <h2>主要功能</h2>
        <ul>
          <li>添加新的待办事项</li>
          <li>标记任务完成状态</li>
          <li>删除不需要的任务</li>
          <li>响应式设计，适配各种设备</li>
        </ul>
        
        <h2>技术栈</h2>
        <p>
          本应用使用以下技术构建：
        </p>
        <ul>
          <li>React 17</li>
          <li>React Router v5</li>
          <li>Vite</li>
          <li>CSS</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;