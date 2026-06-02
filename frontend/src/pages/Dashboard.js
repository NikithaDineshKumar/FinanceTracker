import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { getExpenses, getExpenseSummary, getBudget, getInsights, sendChatMessage } from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { generatePDFReport } from '../utils/pdfReport';

const COLORS = ['#667eea', '#48bb78', '#f6ad55', '#fc8181', '#9f7aea', '#4fd1c5', '#f687b3', '#68d391'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchData = async () => {
    try {
      const [summaryRes, budgetRes, expensesRes] = await Promise.all([
        getExpenseSummary(currentMonth, currentYear),
        getBudget(currentMonth, currentYear),
        getExpenses(currentMonth, currentYear)
      ]);
      setSummary(summaryRes.data);
      setBudget(budgetRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatLoading(true);
    try {
      const { data } = await sendChatMessage(userMessage);
      setChatMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }
    setChatLoading(false);
  };

  const fetchInsights = async () => {
    try {
      const { data } = await getInsights();
      setInsights(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getBudgetHealth = () => {
    if (!budget || !summary) return { color: 'green', percentage: 0 };
    const percentage = (summary.total / budget.amount) * 100;
    if (percentage < 50) return { color: 'green', percentage };
    if (percentage < 80) return { color: 'yellow', percentage };
    return { color: 'red', percentage };
  };

  const getDayWiseData = () => {
    if (!summary?.byDay) return [];
    return Object.entries(summary.byDay)
      .map(([day, amount]) => ({ day: `Day ${day}`, amount }))
      .sort((a, b) => parseInt(a.day.split(' ')[1]) - parseInt(b.day.split(' ')[1]));
  };

  const getCategoryData = () => {
    if (!summary?.byCategory) return [];
    return Object.entries(summary.byCategory)
      .map(([name, value]) => ({ name, value }));
  };

  const health = getBudgetHealth();

  if (loading) return (
    <>
      <Navbar />
      <div className="loading">Loading dashboard...</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">
          Dashboard — {new Date().toLocaleString('default', { month: 'long' })} {currentYear}
        </h1>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Spent</div>
            <div className="stat-value">₹{summary?.total?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Monthly Budget</div>
            <div className="stat-value">₹{budget?.amount?.toFixed(2) || 'Not Set'}</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-label">Remaining Budget</div>
            <div className="stat-value">
              ₹{budget ? (budget.amount - (summary?.total || 0)).toFixed(2) : 'N/A'}
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">{expenses.length}</div>
          </div>
        </div>

        {/* Budget Health */}
        {budget && (
          <div className="card">
            <div className="card-title">Budget Health</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                color: health.color === 'green' ? '#48bb78' : health.color === 'yellow' ? '#f6ad55' : '#fc8181',
                fontWeight: 700,
                fontSize: '18px'
              }}>
                {health.color === 'green' ? '✅ Good' : health.color === 'yellow' ? '⚠️ Warning' : '🚨 Critical'}
              </span>
              <span style={{ color: '#888' }}>{health.percentage.toFixed(1)}% used</span>
            </div>
            <div className="health-bar">
              <div
                className={`health-fill ${health.color}`}
                style={{ width: `${Math.min(health.percentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Needs vs Wants */}
        {summary && (
          <div className="card">
            <div className="card-title">Needs vs Wants</div>
            <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
              <div>
                <span className="tag tag-need">Needs</span>
                <span style={{ marginLeft: '8px', fontWeight: 700 }}>₹{summary.byType?.need?.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span className="tag tag-want">Wants</span>
                <span style={{ marginLeft: '8px', fontWeight: 700 }}>₹{summary.byType?.want?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Day wise Chart */}
        {getDayWiseData().length > 0 && (
          <div className="card">
            <div className="card-title">Day-wise Spending</div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getDayWiseData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Area type="monotone" dataKey="amount" stroke="#667eea" fill="#667eea" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Chart */}
        {getCategoryData().length > 0 && (
          <div className="card">
            <div className="card-title">Spending by Category</div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* PDF Export */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="card-title">📄 Export Report</div>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Download your monthly report as PDF</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => generatePDFReport(summary, budget, expenses, currentMonth, currentYear)}
            >
              📥 Download PDF
            </button>
          </div>
        </div>

        {/* RAG Budget Advisor Chatbot */}
        <div className="card">
          <div className="card-title">💬 Budget Advisor Chat</div>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
            Ask me anything about your spending!
          </p>

          {/* Suggested Questions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {[
              'Am I overspending?',
              'Where can I save money?',
              'What is my top expense?',
              'How is my budget doing?'
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => setChatInput(q)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #667eea',
                  background: 'transparent',
                  color: '#667eea',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div style={{
            height: '300px',
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            background: '#fafafa'
          }}>
            {chatMessages.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', marginTop: '100px', fontSize: '14px' }}>
                Ask a question to get started!
              </p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? '#667eea' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    fontSize: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '18px 18px 18px 4px',
                  background: '#fff',
                  fontSize: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  color: '#888'
                }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your finances..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '24px',
                border: '1px solid #ddd',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={chatLoading}
              style={{ borderRadius: '24px', padding: '10px 20px' }}
            >
              Send
            </button>
          </div>
        </div>

        {/* AI Insights */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="card-title">🤖 AI Spending Insights</div>
            <button className="btn btn-primary" onClick={fetchInsights}>
              Generate Insights
            </button>
          </div>
          {insights.length === 0 ? (
            <p style={{ color: '#888', fontSize: '14px' }}>
              Click "Generate Insights" to get AI-powered analysis of your spending!
            </p>
          ) : (
            insights.map((insight, index) => (
              <div key={index} style={{
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '8px',
                borderLeft: `4px solid ${
                  insight.type === 'danger' ? '#fc8181' :
                  insight.type === 'warning' ? '#f6ad55' :
                  insight.type === 'success' ? '#48bb78' : '#667eea'
                }`,
                background: `${
                  insight.type === 'danger' ? '#fff5f5' :
                  insight.type === 'warning' ? '#fffaf0' :
                  insight.type === 'success' ? '#f0fff4' : '#ebf4ff'
                }`
              }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                  {insight.icon} {insight.title}
                </div>
                <div style={{ fontSize: '14px', color: '#555' }}>
                  {insight.message}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};

export default Dashboard;