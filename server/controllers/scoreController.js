const Score = require('../models/Score');

// @desc    Save game score
// @route   POST /api/scores
// @access  Private
const saveScore = async (req, res) => {
  try {
    const { score, attempts } = req.body;

    if (score === undefined || attempts === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide score and attempts' });
    }

    const newScore = await Score.create({
      userId: req.user._id,
      score,
      attempts
    });

    res.status(201).json({
      success: true,
      data: newScore
    });
  } catch (error) {
    console.error('Save score error:', error.message);
    res.status(500).json({ success: false, message: 'Server error saving score' });
  }
};

// @desc    Fetch top 10 leaderboard
// @route   GET /api/scores/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    // Top 10 scores: highest score first, if equal then lowest attempts first
    const leaderboard = await Score.find()
      .populate('userId', 'name')
      .sort({ score: -1, attempts: 1 })
      .limit(10);

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Fetch leaderboard error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard' });
  }
};

// @desc    Fetch user game history
// @route   GET /api/scores/history
// @access  Private
const getUserHistory = async (req, res) => {
  try {
    const history = await Score.find({ userId: req.user._id })
      .sort({ playedAt: -1 });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Fetch history error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
};

module.exports = {
  saveScore,
  getLeaderboard,
  getUserHistory
};
