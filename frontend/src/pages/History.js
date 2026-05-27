import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getExpenses, getExpenseSummary, getBudget } from '../utils/api';

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const History = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const years = [2024, 2025, 2026, 2027];

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, summaryRes, budgetRes] = await Promise.all([
        getExpenses(selectedMonth, selectedYear),
        getExpenseSummary(selectedMonth, selectedYear),
        getBudget(selectedMonth, selectedYear)
      ]);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
      setBudget(budgetRes.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">History</h1>

        {/* Month/Year Selector */}
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label>Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading history...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Spent</div>
                <div className="stat-value">₹{summary?.total?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">Budget</div>
                <div className="stat-value">
                  {budget ? `₹${budget.amount.toFixed(2)}` : 'Not Set'}
                </div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">Saved</div>
                <div className="stat-value">
                  {budget ? `₹${(budget.amount - (summary?.total || 0)).toFixed(2)}` : 'N/A'}
                </div>
              </div>
              <div className="stat-card purple">
                <div className="stat-label">Transactions</div>
                <div className="stat-value">{expenses.length}</div>
              </div>
            </div>

            {/* Monthly Report */}
            {summary && expenses.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>
                  Monthly Report — {MONTHS[selectedMonth - 1]} {selectedYear}
                </h3>

                {/* Needs vs Wants */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ flex: 1, padding: '16px', background: '#c6f6d5', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#276749', marginBottom: '4px' }}>NEEDS</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#276749' }}>
                      ₹{summary.byType?.need?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: '16px', background: '#fed7e2', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#97266d', marginBottom: '4px' }}>WANTS</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#97266d' }}>
                      ₹{summary.byType?.want?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <h4 style={{ marginBottom: '12px', color: '#555' }}>Category Breakdown</h4>
                {Object.entries(summary.byCategory || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => (
                    <div key={category} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <span style={{ fontWeight: 500 }}>{category}</span>
                      <span style={{ fontWeight: 700, color: '#667eea' }}>₹{amount.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Expenses Table */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <h3>All Transactions</h3>
              </div>
              {expenses.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  No expenses found for {MONTHS[selectedMonth - 1]} {selectedYear}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default History;