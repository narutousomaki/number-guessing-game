import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalGames: 0,
    bestScore: 0,
    avgAttempts: 0
  });

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/scores/history');
      const data = res.data.data;
      setHistory(data);
      
      if (data.length > 0) {
        const total = data.length;
        const highest = Math.max(...data.map(item => item.score));
        const totalAttempts = data.reduce((acc, curr) => acc + curr.attempts, 0);
        const average = (totalAttempts / total).toFixed(1);

        setStats({
          totalGames: total,
          bestScore: highest,
          avgAttempts: average
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to download profile telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass-container">
      <div className="animate-slide-up">
        {/* Profile Header Card */}
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.8rem',
                color: '#fff',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: '900',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
              }}
            >
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>{user.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Registered Node: {user.email}</p>
            </div>
          </div>
        </div>

        {error && <div className="alert-cyber">⚠️ {error}</div>}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats Dashboard Grid */}
            <div className="profile-summary">
              <div className="stat-box">
                <div className="stat-label">Total Runs</div>
                <div className="stat-value" style={{ color: 'var(--neon-cyan)' }}>{stats.totalGames}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Personal High Score</div>
                <div className="stat-value stat-value-highlight">{stats.bestScore}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Avg. Attempts</div>
                <div className="stat-value" style={{ color: 'var(--neon-yellow)' }}>{stats.avgAttempts}</div>
              </div>
            </div>

            {/* Run History Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--neon-cyan)' }}>Telemetry History</h3>
              
              {history.length === 0 ? (
                <div className="empty-state">
                  No telemetry history captured yet. Initialize a run on the play deck to register data.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="leaderboard-table" style={{ marginTop: '0' }}>
                    <thead>
                      <tr>
                        <th>Run Index</th>
                        <th>Score</th>
                        <th>Attempts</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((run, index) => (
                        <tr key={run._id} className="leaderboard-row">
                          <td style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                            #{history.length - index}
                          </td>
                          <td style={{ fontWeight: 'bold', color: 'var(--neon-pink)', fontSize: '1.05rem' }}>
                            {run.score}
                          </td>
                          <td>
                            {run.attempts} {run.attempts === 1 ? 'attempt' : 'attempts'}
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {formatDate(run.playedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
