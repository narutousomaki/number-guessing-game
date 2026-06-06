import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/scores/leaderboard');
      setLeaderboard(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to download leaderboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
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

  const getRankBadgeClass = (index) => {
    if (index === 0) return 'rank-badge rank-1';
    if (index === 1) return 'rank-badge rank-2';
    if (index === 2) return 'rank-badge rank-3';
    return 'rank-badge rank-other';
  };

  return (
    <div className="glass-container">
      <div className="glass-card animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>GLOBAL LEADERBOARD</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Top 10 nodes on the grid</p>
          </div>
          <button onClick={fetchLeaderboard} className="btn-cyber" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            Refresh Data
          </button>
        </div>

        {error && <div className="alert-cyber">⚠️ {error}</div>}

        {loading ? (
          <LoadingSpinner />
        ) : leaderboard.length === 0 ? (
          <div className="empty-state">
            No telemetry data recorded yet. Be the first to secure a score!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Rank</th>
                  <th style={{ width: '40%' }}>Node Handle</th>
                  <th style={{ width: '15%', textRight: 'true' }}>Score</th>
                  <th style={{ width: '15%' }}>Attempts</th>
                  <th style={{ width: '20%' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item._id} className="leaderboard-row">
                    <td>
                      <span className={getRankBadgeClass(index)}>
                        {index + 1}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600', color: '#fff' }}>
                      {item.userId?.name || 'Anonymous Node'}
                    </td>
                    <td style={{ fontWeight: 'bold', color: 'var(--neon-pink)', fontSize: '1.1rem' }}>
                      {item.score}
                    </td>
                    <td style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {item.attempts}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(item.playedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
