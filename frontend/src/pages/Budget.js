import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getBudget, setBudget, getExpenseSummary } from '../utils/api';
import { toast } from 'react-toastify';

const Budget = () => {
  const [budget, setBudgetData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetRes, summaryRes] = await Promise.all([
        getBudget(currentMonth, currentYear),
        getExpenseSummary(currentMonth, currentYear)
      ]);
      setBudgetData(budgetRes.data);
      setSummary(summaryRes.data);
      if (budgetRes.data) {
        setAmount(budgetRes.data.amount);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await setBudget({
        month: currentMonth,
        year: currentYear,
        amount: parseFloat(amount)
      });
      setBudgetData(data);
      toast.success('Budget saved successfully!');
    } catch (error) {
      toast.error('Failed to save budget');
    }
  };

  const getBudgetHealth = () => {
    if (!budget || !summary) return { color: 'green', percentage: 0, status: 'Not Set' };
    const percentage = (summary.total / budget.amount) * 100;
    if (percentage < 50) return { color: '#48bb78', percentage, status: '✅ Good' };
    if (percentage < 80) return { color: '#f6ad55', percentage, status: '⚠️ Warning' };
    return { color: '#fc8181', percentage, status: '🚨 Critical' };
  };

  const health = getBudgetHealth();

  if (loading) return (
    <>
      <Navbar />
      <div className="loading">Loading budget...</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Budget — {monthName} {currentYear}</h1>

        {/* Set Budget Form */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>
            {budget ? 'Update Monthly Budget' : 'Set Monthly Budget'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Budget Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter budget amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {budget ? 'Update Budget' : 'Set Budget'}
            </button>
          </form>
        </div>

        {/* Budget Overview */}
        {budget && summary && (
          <>
            <div className="stats-grid">
              <div className="stat-card green">
                <div className="stat-label">Monthly Budget</div>
                <div className="stat-value">₹{budget.amount.toFixed(2)}</div>
              </div>
              <div className="stat-card red">
                <div className="stat-label">Total Spent</div>
                <div className="stat-value">₹{summary.total.toFixed(2)}</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">Remaining</div>
                <div className="stat-value">
                  ₹{(budget.amount - summary.total).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Health Indicator */}
            <div className="card">
              <div className="card-title">Budget Health</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: health.color, fontWeight: 700, fontSize: '20px' }}>
                  {health.status}
                </span>
                <span style={{ color: '#888' }}>
                  {health.percentage.toFixed(1)}% of budget used
                </span>
              </div>
              <div className="health-bar">
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(health.percentage, 100)}%`,
                    background: health.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>

            {/* Category Breakdown */}
            {summary.byCategory && (
              <div className="card">
                <div className="card-title" style={{ marginBottom: '16px' }}>
                  Spending by Category
                </div>
                {Object.entries(summary.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => (
                    <div key={category} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{category}</span>
                        <span style={{ fontSize: '14px', color: '#888' }}>₹{amount.toFixed(2)}</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                        <div style={{
                          height: '100%',
                          width: `${(amount / budget.amount) * 100}%`,
                          background: '#667eea',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Needs vs Wants */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: '16px' }}>Needs vs Wants</div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '20px', background: '#c6f6d5', borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#276749', marginBottom: '8px' }}>NEEDS</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#276749' }}>
                    ₹{summary.byType?.need?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '20px', background: '#fed7e2', borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#97266d', marginBottom: '8px' }}>WANTS</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#97266d' }}>
                    ₹{summary.byType?.want?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Budget;