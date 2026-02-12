import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center hover:opacity-80">
            <h1 className="text-2xl font-bold text-primary">Virtual Front Desk</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                !isAdmin
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Worksheet
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isAdmin
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
