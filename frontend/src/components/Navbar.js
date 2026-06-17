import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { FiMenu, FiX, FiLogOut, FiHome, FiDollarSign, FiPieChart, FiClock, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <FiHome /> },
    { path: '/expenses', label: 'Expenses', icon: <FiDollarSign /> },
    { path: '/budget', label: 'Budget', icon: <FiPieChart /> },
    { path: '/history', label: 'History', icon: <FiClock /> },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        💰 Finance Tracker
      </Link>

      {/* Desktop Links */}
      <div className="navbar-links desktop-nav">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={location.pathname === link.path ? 'active' : ''}
          >
            {link.icon} {link.label}
          </Link>
        ))}
        <span className="nav-user">Hi, {user?.name}!</span>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <span className="nav-user">Hi, {user?.name}!</span>
          <button className="theme-toggle mobile-theme-toggle" onClick={toggleTheme}>
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            {darkMode ? ' Light Mode' : ' Dark Mode'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;