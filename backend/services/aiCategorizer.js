const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Grocery',
  'Vegetables', 'Tuition', 'Maid', 'Current',
  'Hospital', 'Medicine', 'Milk', 'Cosmetics',
  'Stationary', 'Dress', 'Service', 'Other'
];

const needs = ['Food', 'Grocery', 'Vegetables', 'Medicine', 'Hospital', 'Milk', 'Current', 'Tuition'];

const categorizeExpense = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
      You are a personal finance assistant. 
      Analyze this expense description and return a JSON response.
      
      Expense: "${text}"
      
      Available categories: ${CATEGORIES.join(', ')}
      
      Return ONLY a JSON object with these fields:
      {
        "category": "one of the available categories",
        "amount": number or null if not mentioned,
        "type": "need" or "want",
        "confidence": number between 0-100
      }
      
      Rules:
      - needs are: Food, Grocery, Vegetables, Medicine, Hospital, Milk, Current, Tuition
      - wants are: Shopping, Cosmetics, Dress, Service, Transport, Maid, Stationary, Other
      - Extract amount if mentioned in the text
      - Return ONLY the JSON, no extra text
    `;
    console.log('Using Gemini API for categorization...');
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean response and parse JSON
    const cleanResponse = response.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanResponse);

    return {
      category: parsed.category || 'Other',
      type: parsed.type || 'want',
      amount: parsed.amount || null,
      confidence: parsed.confidence || 85
    };

  } catch (error) {
    console.error('Gemini API Error:', error.message);
    
    // Fallback to rule-based
    const lowerText = text.toLowerCase();
    const categoryRules = {
      'Food': ['food', 'eat', 'meal', 'lunch', 'dinner', 'breakfast', 'restaurant'],
      'Grocery': ['grocery', 'groceries', 'supermarket', 'store'],
      'Vegetables': ['vegetable', 'vegetables', 'veggies', 'tomato', 'onion'],
      'Transport': ['transport', 'bus', 'auto', 'cab', 'uber', 'petrol', 'fuel'],
      'Shopping': ['shopping', 'bought', 'purchase', 'amazon', 'flipkart'],
      'Tuition': ['tuition', 'fees', 'college', 'school', 'course'],
      'Maid': ['maid', 'servant', 'cleaning', 'cook'],
      'Current': ['current', 'electricity', 'electric', 'bill', 'eb'],
      'Hospital': ['hospital', 'doctor', 'clinic', 'medical'],
      'Medicine': ['medicine', 'tablet', 'capsule', 'pharmacy'],
      'Milk': ['milk', 'dairy', 'curd', 'butter'],
      'Cosmetics': ['cosmetics', 'makeup', 'cream', 'shampoo', 'soap'],
      'Stationary': ['stationary', 'pen', 'pencil', 'notebook'],
      'Dress': ['dress', 'clothes', 'shirt', 'pant', 'shoes'],
      'Service': ['service', 'repair', 'maintenance', 'plumber']
    };

    let detectedCategory = 'Other';
    let highestMatch = 0;

    for (const [category, keywords] of Object.entries(categoryRules)) {
      const matches = keywords.filter(k => lowerText.includes(k)).length;
      if (matches > highestMatch) {
        highestMatch = matches;
        detectedCategory = category;
      }
    }

    const type = needs.includes(detectedCategory) ? 'need' : 'want';
    const amountMatch = text.match(/\d+(\.\d+)?/);

    return {
      category: detectedCategory,
      type,
      amount: amountMatch ? parseFloat(amountMatch[0]) : null,
      confidence: 75
    };
  }
};

module.exports = { categorizeExpense };