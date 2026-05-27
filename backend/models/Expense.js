const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food', 'Transport', 'Shopping', 'Grocery',
      'Vegetables', 'Tuition', 'Maid', 'Current',
      'Hospital', 'Medicine', 'Milk', 'Cosmetics',
      'Stationary', 'Dress', 'Service', 'Other'
    ]
  },
  customCategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['need', 'want'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);