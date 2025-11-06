import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">To-Do App</h1>
        <ul className="navbar-menu">
          <li>
            <NavLink 
              to="/" 
              exact 
              activeClassName="active" 
              className="nav-link"
            >
              首页
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              activeClassName="active" 
              className="nav-link"
            >
              关于
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;