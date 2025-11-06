import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 创建上下文
const TodoContext = createContext();

// 初始状态
const initialState = {
  todos: [],
  nextId: 1,
  filter: 'all' // 'all', 'active', 'completed'
};

// Action Types
const ActionTypes = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  EDIT_TODO: 'EDIT_TODO',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  SET_FILTER: 'SET_FILTER',
  LOAD_TODOS: 'LOAD_TODOS'
};

// Reducer函数
const todoReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, {
          id: state.nextId,
          text: action.payload,
          completed: false,
          createdAt: new Date().toISOString()
        }],
        nextId: state.nextId + 1
      };
      
    case ActionTypes.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload 
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
      
    case ActionTypes.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
      
    case ActionTypes.EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload.id 
            ? { ...todo, text: action.payload.text }
            : todo
        )
      };
      
    case ActionTypes.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
      
    case ActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };
      
    case ActionTypes.LOAD_TODOS:
      return {
        ...state,
        todos: action.payload.todos,
        nextId: action.payload.nextId
      };
      
    default:
      return state;
  }
};

// 从本地存储加载任务
const loadTodosFromLocalStorage = () => {
  try {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      return parsed;
    }
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
  }
  return initialState;
};

// 保存任务到本地存储
const saveTodosToLocalStorage = (state) => {
  try {
    const { todos, nextId } = state;
    localStorage.setItem('todos', JSON.stringify({ todos, nextId }));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

// Provider组件
export const TodoProvider = ({ children }) => {
  // 初始化状态时从本地存储加载
  const loadedState = loadTodosFromLocalStorage();
  const [state, dispatch] = useReducer(todoReducer, loadedState);
  
  // 当任务状态变化时保存到本地存储
  useEffect(() => {
    saveTodosToLocalStorage(state);
  }, [state.todos, state.nextId]);
  
  // 根据当前筛选条件获取任务
  const getFilteredTodos = () => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  };
  
  // 获取统计信息
  const getStats = () => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };
  
  // 提供给组件使用的操作方法
  const todoActions = {
    addTodo: (text) => {
      dispatch({ type: ActionTypes.ADD_TODO, payload: text });
    },
    toggleTodo: (id) => {
      dispatch({ type: ActionTypes.TOGGLE_TODO, payload: id });
    },
    deleteTodo: (id) => {
      dispatch({ type: ActionTypes.DELETE_TODO, payload: id });
    },
    editTodo: (id, text) => {
      dispatch({ type: ActionTypes.EDIT_TODO, payload: { id, text } });
    },
    clearCompleted: () => {
      dispatch({ type: ActionTypes.CLEAR_COMPLETED });
    },
    setFilter: (filter) => {
      dispatch({ type: ActionTypes.SET_FILTER, payload: filter });
    },
    getFilteredTodos,
    getStats
  };
  
  return (
    <TodoContext.Provider value={{ ...state, ...todoActions }}>
      {children}
    </TodoContext.Provider>
  );
};

// 自定义Hook，方便组件使用上下文
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};