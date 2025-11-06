import React from 'react';
import './App.css';
import AppRouter from './router/AppRouter';
import { TodoProvider } from './store/TodoContext';

const App = () => {
  return (
    <TodoProvider>
      <div className="app">
        <AppRouter />
      </div>
    </TodoProvider>
  );
};

export default App;