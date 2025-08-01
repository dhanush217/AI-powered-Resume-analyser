import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const navLinkClasses = (path: string) =>
    `relative font-medium text-gray-600 before:absolute before:-bottom-1 before:h-0.5 before:w-full before:origin-left before:scale-x-0 before:bg-gray-800 before:transition-transform before:duration-300 before:ease-in-out hover:text-gray-800 hover:before:scale-x-100 ${
      location.pathname === path ? 'text-gray-900' : ''
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 shadow-md backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          <Link to="/">Resume Analyzer</Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className={navLinkClasses('/')}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/analyze" className={navLinkClasses('/analyze')}>
                Analyze
              </Link>
            </li>
            <li>
              <Link to="/about" className={navLinkClasses('/about')}>
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
