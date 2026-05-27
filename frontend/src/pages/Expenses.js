import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../utils/api';
import { toast } from 'react-toastify';

const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Grocery',
  'Vegetables', 'Tuition', 'Maid', 'Current',
  'Hospital', 'Medicine', 'Milk', 'Cosmetics',
  'Stationary', 'Dress', 'Service', 'Other'
];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    customCategory: '',
    description: '',
    type: 'need',
    date: new Date().toISOString().split('T')[0]
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await getExpenses(currentMonth, currentYear);
      setExpenses(data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExpense(editingId, form);
        toast.success('Expense updated!');
      } else {
        await addExpense(form);
        toast.success('Expense added!');
      }
      resetForm();
      fetchExpenses();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleEdit = (expense) => {
    setForm({
      amount: expense.amount,
      category: expense.category,
      customCategory: expense.customCategory || '',
      description: expense.description || '',
      type: expense.type,
      date: new Date(expense.date).toISOString().split('T')[0]
    });
    setEditingId(expense._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted!');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const resetForm = () => {
    setForm({
      amount: '',
      category: 'Food',
      customCategory: '',
      description: '',
      type: 'need',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setShowForm(false);
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) return (
    <>
      <Navbar />
      <div className="loading">Loading expenses...</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Expenses</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Expense'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                {form.category === 'Other' && (
                  <div className="form-group">
                    <label>Custom Category</label>
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={form.customCategory}
                      onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="need">Need</option>
                    <option value="want">Want</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description (optional)</label>
                  <input
                    type="text"
                    placeholder="Add a note"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Expense' : 'Add Expense'}
                </button>
                <button type="button" className="btn btn-danger" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary */}
        <div className="card" style={{ padding: '16px 24px' }}>
          <span style={{ color: '#888', fontSize: '14px' }}>
            {expenses.length} expenses this month
          </span>
          <span style={{ float: 'right', fontWeight: 700, fontSize: '18px' }}>
            Total: ₹{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Expenses Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          {expenses.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              No expenses added yet. Click "+ Add Expense" to get started!
            </div>
          ) : (
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense._id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.category === 'Other' ? expense.customCategory : expense.category}</td>
                    <td>{expense.description || '-'}</td>
                    <td>
                      <span className={`tag tag-${expense.type}`}>
                        {expense.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{expense.amount}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-edit" onClick={() => handleEdit(expense)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(expense._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Expenses;