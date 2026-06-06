import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-cyber">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ⚡ <span>QUANTUM GUESS</span>
        </Link>
        
        <nav className="navbar-links">
          {user ? (
            <>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
                end
              >
                Play
              </NavLink>
              <NavLink 
                to="/leaderboard" 
                className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              >
                Leaderboard
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              >
                Profile
              </NavLink>
              <div className="user-badge">
                👤 {user.name}
              </div>
              <button 
                onClick={handleLogout} 
                className="btn-cyber btn-cyber-pink"
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/leaderboard" 
                className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              >
                Leaderboard
              </NavLink>
              <NavLink 
                to="/login" 
                className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
