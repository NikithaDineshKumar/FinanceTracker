const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');

// @route   GET /api/budget
router.get('/', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const budget = await Budget.findOne({
      user: req.user._id,
      month: parseInt(month),
      year: parseInt(year)
    });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/budget
router.post('/', protect, async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    // Check if budget exists for this month
    let budget = await Budget.findOne({
      user: req.user._id,
      month: parseInt(month),
      year: parseInt(year)
    });

    if (budget) {
      // Update existing
      budget.amount = amount;
      await budget.save();
    } else {
      // Create new
      budget = await Budget.create({
        user: req.user._id,
        month: parseInt(month),
        year: parseInt(year),
        amount
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/budget/all
router.get('/all', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ 
      user: req.user._id 
    }).sort({ year: -1, month: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;