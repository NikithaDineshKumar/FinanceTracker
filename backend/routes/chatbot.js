const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { chatWithAdvisor } = require('../services/chatbotService');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

router.post('/', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const currentStart = new Date(currentYear, currentMonth - 1, 1);
    const currentEnd = new Date(currentYear, currentMonth, 0);

    const [expenses, budget] = await Promise.all([
      Expense.find({ user: req.user._id, date: { $gte: currentStart, $lte: currentEnd } }),
      Budget.findOne({ user: req.user._id, month: currentMonth, year: currentYear })
    ]);

    const byCategory = {};
    const byType = { need: 0, want: 0 };
    let total = 0;

    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      byType[e.type] += e.amount;
      total += e.amount;
    });

    const expenseData = {
      total,
      budget: budget?.amount || null,
      byCategory,
      byType,
      transactionCount: expenses.length,
      recentExpenses: expenses.slice(-5).map(e => ({
        description: e.description,
        amount: e.amount,
        category: e.category,
        date: e.date
      }))
    };

    const reply = await chatWithAdvisor(message, expenseData);
    res.json({ reply });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;