const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { categorizeExpense } = require('../services/aiCategorizer');

// @route   POST /api/ai/categorize
router.post('/categorize', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const result = await categorizeExpense(text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;