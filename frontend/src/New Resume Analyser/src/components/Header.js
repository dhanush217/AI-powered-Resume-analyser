import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span>AI powered Resume Analyser</span>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/insights">Insights</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><button className="login-btn">Login</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
