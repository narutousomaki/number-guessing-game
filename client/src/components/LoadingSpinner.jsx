import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner-cyber"></div>
      <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', color: 'var(--neon-cyan)', letterSpacing: '1px', marginTop: '1rem' }}>
        LOADING SYSTEM DATA...
      </p>
    </div>
  );
};

export default LoadingSpinner;
