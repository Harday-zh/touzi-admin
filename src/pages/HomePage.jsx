import React, { useState } from 'react';
import { useTodoContext } from '../store/TodoContext';

const HomePage = () => {
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt' or 'text'
  
  const { 
    filter, 
    addTodo, 
    toggleTodo, 
    deleteTodo, 
    editTodo,
    clearCompleted,
    setFilter,
    getFilteredTodos,
    getStats
  } = useTodoContext();

  const filteredTodos = getFilteredTodos();
  const { total, completed, active } = getStats();

  // 排序任务
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'text') {
      return a.text.localeCompare(b.text);
    }
    return 0;
  });

  const handleAddTodo = () => {
    if (inputText.trim() !== '') {
      addTodo(inputText.trim());
      setInputText('');
    }
  };

  const handleToggleTodo = (id) => {
    toggleTodo(id);
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id);
    if (editingId === id) {
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const handleSaveEdit = (id) => {
    if (editingText.trim() !== '') {
      editTodo(id, editingText.trim());
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app-container">
      <h1>交互式任务管理系统</h1>
      
      {/* 输入区域 */}
      <div className="input-section">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="添加新的待办事项..."
          className="todo-input"
          autoFocus
        />
        <button onClick={handleAddTodo} className="add-button">
          添加
        </button>
      </div>

      {/* 统计信息 */}
      <div className="stats-section">
        <div className="stats-info">
          <span>总共: {total}</span>
          <span>进行中: {active}</span>
          <span>已完成: {completed}</span>
        </div>
        {completed > 0 && (
          <button 
            onClick={clearCompleted} 
            className="clear-button"
            title="清空所有已完成的任务"
          >
            清空已完成
          </button>
        )}
      </div>

      {/* 排序和筛选 */}
      <div className="controls-section">
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            进行中
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            已完成
          </button>
        </div>
        
        <div className="sort-controls">
          <label htmlFor="sort-select">排序: </label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">时间倒序</option>
            <option value="text">字母顺序</option>
          </select>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="todo-list">
        {sortedTodos.length === 0 ? (
          <p className="empty-message">
            {filter === 'all' && total > 0 ? 
              '暂无任务，请添加新任务！' : 
              filter === 'active' ? 
                '所有任务都已完成！' : 
                '暂无已完成的任务！'
            }
          </p>
        ) : (
          sortedTodos.map(todo => (
            <div 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'todo-completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="todo-checkbox"
                title="标记完成/未完成"
              />
              
              {editingId === todo.id ? (
                <div className="edit-input-wrapper">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                    className="todo-edit-input"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => handleSaveEdit(todo.id)}
                      className="save-button"
                      title="保存修改"
                    >
                      保存
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="cancel-button"
                      title="取消编辑"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="todo-content">
                  <span 
                    className={`todo-text ${todo.completed ? 'completed' : ''}`}
                    onDoubleClick={() => handleStartEdit(todo)}
                    title={`双击编辑 (创建于: ${formatDate(todo.createdAt)})`}
                  >
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    <button
                      onClick={() => handleStartEdit(todo)}
                      className="edit-button"
                      title="编辑任务"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="delete-button"
                      title="删除任务"
                    >
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 操作提示 */}
      <div className="help-tips">
        <p>💡 提示：双击任务文本可编辑，按Enter保存，按Esc取消</p>
      </div>
    </div>
  );
};

export default HomePage;