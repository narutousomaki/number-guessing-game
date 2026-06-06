import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = ({ login }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Security key must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await API.post('/auth/register', { name, email, password });
      
      // Save details via parent state
      login(res.data.token, { name: res.data.name, email: res.data.email });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please check network logs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-container">
      <div className="auth-wrapper animate-slide-up">
        <div className="auth-header">
          <h2>REGISTER NODE</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create a new identity on the gaming grid</p>
        </div>

        <div className="glass-card">
          {error && <div className="alert-cyber">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Handle (Name)</label>
              <input
                type="text"
                id="name"
                className="input-cyber"
                placeholder="Neo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Comms Address (Email)</label>
              <input
                type="email"
                id="email"
                className="input-cyber"
                placeholder="neo@matrix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Security Key (Password)</label>
              <input
                type="password"
                id="password"
                className="input-cyber"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Security Key</label>
              <input
                type="password"
                id="confirmPassword"
                className="input-cyber"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-cyber btn-cyber-block"
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'REGISTERING...' : 'REGISTER & INITIALIZE'}
            </button>
          </form>

          <div className="auth-footer">
            Already registered? <Link to="/login">Access Session</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
