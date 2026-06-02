const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInsights = async (currentData, previousData) => {
  try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
      You are a personal finance advisor.
      Analyze this spending data and give 4-5 short, personalized insights.
      
      Current Month Spending:
      - Total: ₹${currentData.total}
      - Budget: ₹${currentData.budget || 'Not set'}
      - By Category: ${JSON.stringify(currentData.byCategory)}
      - Needs vs Wants: ${JSON.stringify(currentData.byType)}
      
      Previous Month Spending:
      - Total: ₹${previousData?.total || 0}
      - By Category: ${JSON.stringify(previousData?.byCategory || {})}
      
      Return ONLY a JSON array of insights like this:
      [
        {
          "type": "warning/success/info/danger",
          "icon": "emoji",
          "title": "short title",
          "message": "detailed insight message"
        }
      ]
      
      Rules:
      - Be specific with numbers and percentages
      - Compare with previous month where possible
      - Give actionable advice
      - Use ₹ for amounts
      - Return ONLY the JSON array, no extra text
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleanResponse = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanResponse);

  } catch (error) {
    console.error('Insights Error:', error.message);
    // Fallback insights
    const insights = [];
    
    if (currentData.budget && currentData.total > currentData.budget) {
      insights.push({
        type: 'danger',
        icon: '🚨',
        title: 'Budget Exceeded!',
        message: `You have exceeded your budget by ₹${(currentData.total - currentData.budget).toFixed(2)}`
      });
    }

    if (currentData.byType?.want > currentData.byType?.need) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'High Want Spending',
        message: `You spent more on wants (₹${currentData.byType.want}) than needs (₹${currentData.byType.need})`
      });
    }

    const topCategory = Object.entries(currentData.byCategory || {})
      .sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory) {
      insights.push({
        type: 'info',
        icon: '📊',
        title: 'Top Spending Category',
        message: `Your highest spending is on ${topCategory[0]} at ₹${topCategory[1].toFixed(2)}`
      });
    }

    return insights;
  }
};

module.exports = { generateInsights };