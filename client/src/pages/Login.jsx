import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      
      // Save details via parent state
      login(res.data.token, { name: res.data.name, email: res.data.email });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Authorization failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-container">
      <div className="auth-wrapper animate-slide-up">
        <div className="auth-header">
          <h2>SYSTEM ACCESS</h2>
          <p style={{ color: 'var(--text-muted)' }}>Enter credentials to initialize grid</p>
        </div>

        <div className="glass-card">
          {error && <div className="alert-cyber">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="input-cyber"
                placeholder="developer@matrix.com"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-cyber btn-cyber-block"
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
            </button>
          </form>

          <div className="auth-footer">
            New node on the grid? <Link to="/register">Register Node</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
