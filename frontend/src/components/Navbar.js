import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        💰 Finance Tracker
      </Link>
      <div className="navbar-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link 
          to="/expenses" 
          className={location.pathname === '/expenses' ? 'active' : ''}>
          Expenses
        </Link>
        <Link 
          to="/budget" 
          className={location.pathname === '/budget' ? 'active' : ''}>
          Budget
        </Link>
        <Link 
          to="/history" 
          className={location.pathname === '/history' ? 'active' : ''}>
          History
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
          Hi, {user?.name}!
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;