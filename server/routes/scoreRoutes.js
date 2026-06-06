const express = require('express');
const router = express.Router();
const { saveScore, getLeaderboard, getUserHistory } = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');

router.get('/leaderboard', getLeaderboard);
router.post('/', protect, saveScore);
router.get('/history', protect, getUserHistory);

module.exports = router;
