const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

// @route   GET /api/expenses
router.get('/', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { user: req.user._id };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/expenses
router.post('/', protect, async (req, res) => {
  try {
    const { amount, category, customCategory, description, type, date } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      customCategory,
      description,
      type,
      date: date || Date.now()
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/expenses/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/expenses/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/expenses/summary
router.get('/summary', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: start, $lte: end }
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = {};
    const byType = { need: 0, want: 0 };
    const byDay = {};

    expenses.forEach(e => {
      // By category
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      // By type
      byType[e.type] += e.amount;
      // By day
      const day = new Date(e.date).getDate();
      byDay[day] = (byDay[day] || 0) + e.amount;
    });

    res.json({ total, byCategory, byType, byDay });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;