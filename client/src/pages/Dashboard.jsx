import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Dashboard = ({ user }) => {
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('Welcome! Enter a number below to start.');
  const [feedbackType, setFeedbackType] = useState('default'); // 'default', 'high', 'low', 'correct'
  const [gameOver, setGameOver] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [guessDistance, setGuessDistance] = useState(0); // 0 to 100 representation of closeness
  const [shakeInput, setShakeInput] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [historySummaries, setHistorySummaries] = useState([]);

  // Initialize a new game
  const startNewGame = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNum);
    setGuess('');
    setAttempts(0);
    setFeedback('Game initialized. Input your guess between 1 and 100.');
    setFeedbackType('default');
    setGameOver(false);
    setCurrentScore(0);
    setGuessDistance(0);
    setSaveSuccess(false);
  };

  // Run on mount
  useEffect(() => {
    startNewGame();
    fetchUserBestScore();
  }, []);

  const fetchUserBestScore = async () => {
    try {
      const res = await API.get('/scores/history');
      const history = res.data.data;
      setHistorySummaries(history.slice(0, 5)); // Grab last 5 games for quick status
      if (history.length > 0) {
        const highest = Math.max(...history.map(s => s.score));
        setBestScore(highest);
      } else {
        setBestScore(0);
      }
    } catch (err) {
      console.error('Error fetching score history:', err);
    }
  };

  const handleGuessSubmit = async (e) => {
    e.preventDefault();

    if (gameOver) return;

    const numericGuess = parseInt(guess, 10);

    // Validation
    if (isNaN(numericGuess) || numericGuess < 1 || numericGuess > 100) {
      setFeedback('⚠️ Invalid input! Please enter a number between 1 and 100.');
      setFeedbackType('default');
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 400);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    // Calculate absolute difference for the thermometer/heat gauge
    const diff = Math.abs(numericGuess - targetNumber);
    // Convert to percentage: smaller diff = higher percentage (closer)
    // Formula: Closeness % = max(0, 100 - (diff * 2))
    const closeness = Math.max(0, 100 - (diff * 2));
    setGuessDistance(closeness);

    if (numericGuess > targetNumber) {
      setFeedback('TOO HIGH! Try a lower number.');
      setFeedbackType('high');
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 400);
    } else if (numericGuess < targetNumber) {
      setFeedback('TOO LOW! Try a higher number.');
      setFeedbackType('low');
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 400);
    } else {
      // Correct Guess!
      setFeedback('CORRECT GUESS! Quantum target locked.');
      setFeedbackType('correct');
      setGameOver(true);

      // Score formula: Score = max(10, 100 - (attempts) * 10)
      // Since attempts starts at 0, if they get it in 1 attempt (nextAttempts=1), score is 100.
      const computedScore = Math.max(10, 100 - (nextAttempts - 1) * 10);
      setCurrentScore(computedScore);

      if (computedScore > bestScore) {
        setBestScore(computedScore);
      }

      // Save score to database
      await saveGameResult(computedScore, nextAttempts);
    }

    setGuess('');
  };

  const saveGameResult = async (score, attemptsCount) => {
    try {
      setSavingScore(true);
      await API.post('/scores', {
        score,
        attempts: attemptsCount
      });
      setSaveSuccess(true);
      // Reload history to update sidebar
      fetchUserBestScore();
    } catch (err) {
      console.error('Error saving score:', err);
    } finally {
      setSavingScore(false);
    }
  };

  // Determine thermometer bar color based on guess closeness
  const getHeatColor = () => {
    if (feedbackType === 'correct') return 'var(--neon-green)';
    if (guessDistance > 80) return 'var(--neon-pink)'; // Hot
    if (guessDistance > 50) return 'var(--neon-orange)'; // Warm
    return 'var(--neon-cyan)'; // Cold
  };

  return (
    <div className="glass-container">
      <div className="game-grid animate-slide-up">
        {/* Main Game Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem' }}>Game Terminal</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Orbitron, sans-serif' }}>
              STATUS: ACTIVE
            </span>
          </div>

          <div className="game-console">
            {gameOver ? (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '4rem' }}>🏆</div>
                <h3 style={{ color: 'var(--neon-green)', marginBottom: '0.5rem', fontSize: '1.8rem' }}>MISSION ACCOMPLISHED</h3>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                  You guessed the quantum number in <strong style={{ color: 'var(--neon-pink)' }}>{attempts}</strong> attempts!
                </p>
                
                <div className="stat-grid" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                  <div className="stat-box">
                    <div className="stat-label">Final Score</div>
                    <div className="stat-value stat-value-highlight">{currentScore}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Target Number</div>
                    <div className="stat-value" style={{ color: 'var(--neon-cyan)' }}>{targetNumber}</div>
                  </div>
                </div>

                {savingScore ? (
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                    Uploading telemetry to central mainframe...
                  </p>
                ) : saveSuccess ? (
                  <p style={{ color: 'var(--neon-green)', marginBottom: '1.5rem', fontWeight: '500' }}>
                    ✔ Score saved successfully to the leaderboard.
                  </p>
                ) : (
                  <p style={{ color: 'var(--neon-pink)', marginBottom: '1.5rem' }}>
                    ⚠️ Connection error. Score was not saved.
                  </p>
                )}

                <button onClick={startNewGame} className="btn-cyber btn-cyber-pink animate-glow">
                  Initialize Next Run
                </button>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <div 
                  className={`feedback-bubble feedback-${feedbackType}`}
                >
                  {feedback}
                </div>

                {/* Heat/Thermometer Meter */}
                <div style={{ margin: '2rem 0 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>COLD</span>
                    <span>WARM</span>
                    <span>HOT</span>
                  </div>
                  <div className="heat-meter-container">
                    <div 
                      className="heat-meter-bar"
                      style={{ 
                        width: `${guessDistance}%`,
                        backgroundColor: getHeatColor(),
                        boxShadow: `0 0 12px ${getHeatColor()}`
                      }}
                    ></div>
                  </div>
                </div>

                <form onSubmit={handleGuessSubmit} style={{ marginTop: '2rem' }}>
                  <div className="form-group" style={{ alignItems: 'center' }}>
                    <label htmlFor="guess" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      Enter Guess (1 - 100)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      id="guess"
                      className={`input-cyber input-cyber-guess ${shakeInput ? 'animate-shake' : ''}`}
                      placeholder="--"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      disabled={gameOver}
                      autoFocus
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button 
                      type="submit" 
                      className="btn-cyber" 
                      style={{ flex: 2 }}
                      disabled={gameOver}
                    >
                      Transmit Guess
                    </button>
                    <button 
                      type="button" 
                      onClick={startNewGame} 
                      className="btn-cyber btn-cyber-pink"
                      style={{ flex: 1 }}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Stats Box */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--neon-cyan)' }}>Telemetry Overview</h3>
            
            <div className="stat-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="stat-box">
                <div className="stat-label">Best Score</div>
                <div className="stat-value stat-value-highlight">{bestScore}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Current Attempts</div>
                <div className="stat-value" style={{ color: 'var(--neon-cyan)' }}>{attempts}</div>
              </div>
            </div>
          </div>

          {/* Quick Instructions / Last Runs */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--neon-pink)' }}>Telemetry Logs</h3>
            {historySummaries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {historySummaries.map((run, index) => (
                  <div 
                    key={run._id || index}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      background: 'rgba(0, 0, 0, 0.25)', 
                      padding: '0.65rem 0.85rem', 
                      borderRadius: '6px',
                      borderLeft: '2px solid var(--neon-pink)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>
                      Run #{historySummaries.length - index}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {run.attempts} attempts
                    </span>
                    <strong style={{ color: 'var(--neon-cyan)' }}>
                      Score: {run.score}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                No active logs registered on this node. Complete a run to capture telemetry.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
