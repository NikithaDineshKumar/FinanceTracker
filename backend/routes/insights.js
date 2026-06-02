const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateInsights } = require('../services/insightsService');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @route   GET /api/insights
router.get('/', protect, async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    // Previous month
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Current month data
    const currentStart = new Date(currentYear, currentMonth - 1, 1);
    const currentEnd = new Date(currentYear, currentMonth, 0);
    
    // Previous month data
    const prevStart = new Date(prevYear, prevMonth - 1, 1);
    const prevEnd = new Date(prevYear, prevMonth, 0);

    const [currentExpenses, prevExpenses, budget] = await Promise.all([
      Expense.find({ user: req.user._id, date: { $gte: currentStart, $lte: currentEnd } }),
      Expense.find({ user: req.user._id, date: { $gte: prevStart, $lte: prevEnd } }),
      Budget.findOne({ user: req.user._id, month: currentMonth, year: currentYear })
    ]);

    // Process current month
    const currentData = {
      total: currentExpenses.reduce((sum, e) => sum + e.amount, 0),
      budget: budget?.amount || null,
      byCategory: {},
      byType: { need: 0, want: 0 }
    };

    currentExpenses.forEach(e => {
      currentData.byCategory[e.category] = (currentData.byCategory[e.category] || 0) + e.amount;
      currentData.byType[e.type] += e.amount;
    });

    // Process previous month
    const previousData = {
      total: prevExpenses.reduce((sum, e) => sum + e.amount, 0),
      byCategory: {}
    };

    prevExpenses.forEach(e => {
      previousData.byCategory[e.category] = (previousData.byCategory[e.category] || 0) + e.amount;
    });

    const insights = await generateInsights(currentData, previousData);
    res.json(insights);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;