const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithAdvisor = async (userMessage, expenseData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const context = `
      You are a helpful personal finance advisor for an Indian user.
      You have access to their current month's expense data:
      
      - Total Spent: ₹${expenseData.total}
      - Monthly Budget: ₹${expenseData.budget || 'Not set'}
      - Remaining Budget: ₹${expenseData.budget ? (expenseData.budget - expenseData.total) : 'N/A'}
      - Spending by Category: ${JSON.stringify(expenseData.byCategory)}
      - Needs vs Wants: ${JSON.stringify(expenseData.byType)}
      - Number of Transactions: ${expenseData.transactionCount}
      - Recent Expenses: ${JSON.stringify(expenseData.recentExpenses)}
      
      Answer the user's question in a helpful, concise, and friendly way.
      Use ₹ for amounts. Keep response under 150 words.
      Give specific advice based on their actual data.
    `;

    const result = await model.generateContent(`${context}\n\nUser: ${userMessage}`);
    return result.response.text();

  } catch (error) {
    console.error('Chatbot Error:', error.message);
    return 'Sorry, I am unable to process your request right now. Please try again in a moment.';
  }
};

module.exports = { chatWithAdvisor };