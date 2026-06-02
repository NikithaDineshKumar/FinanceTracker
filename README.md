# 💰 Finance Tracker

A full-stack personal finance tracking application built with the MERN stack. Track your daily expenses, set monthly budgets, visualize spending patterns, get AI-powered financial insights, and chat with an AI budget advisor.

![Finance Tracker](https://img.shields.io/badge/MERN-Stack-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Live-brightgreen)

---

## 🚀 Live Demo

🌐 **Frontend:** [https://finance-tracker-gray-xi.vercel.app](https://finance-tracker-gray-xi.vercel.app)  
🔧 **Backend API:** [https://financetracker-w0af.onrender.com](https://financetracker-w0af.onrender.com)

> ⚠️ The backend is hosted on Render's free tier and may take 30-50 seconds to wake up on the first request.

---

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** — JWT-based login/signup with bcrypt password hashing
- 💸 **Expense Management** — Add, edit, and delete daily expenses
- 📂 **Smart Categories** — 16 predefined categories (Food, Transport, Grocery, etc.)
- 🏷️ **Needs vs Wants** — Automatically tag every expense to track spending habits
- 📊 **Visual Dashboard** — Day-wise area charts and category pie charts
- 💰 **Budget Management** — Set monthly budgets with health indicators
- 🟢 **Budget Health** — Green/Yellow/Red indicator based on spending percentage
- 📅 **Expense History** — View and analyze expenses from previous months
- 📄 **PDF Report Export** — Download monthly reports as beautifully formatted PDFs

### AI Features
- 🤖 **AI Expense Categorizer** — Auto-categorize expenses using Google Gemini 2.5 Flash
- 🔄 **Rule-based Fallback** — Smart keyword-based categorization when AI is unavailable
- 💬 **RAG Budget Advisor Chatbot** — Chat with an AI advisor about your spending habits
- 📈 **Smart Spending Insights** — AI-generated personalized financial insights

### Security Features
- 🔒 JWT Authentication with 30-day expiry
- 🔑 bcrypt password hashing (salt rounds: 10)
- 🛡️ Protected API routes with middleware
- 🔐 Environment variables for all secrets

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI Framework |
| React Router DOM | Client-side routing |
| Recharts | Data visualization |
| Axios | HTTP requests |
| jsPDF + jspdf-autotable | PDF report generation |
| React Toastify | Notifications |
| React Icons | Icon library |
| CSS3 | Custom responsive styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud NoSQL database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin requests |
| dotenv | Environment variables |

### AI
| Technology | Purpose |
|---|---|
| Google Gemini API | LLM inference |
| Gemini 2.5 Flash | Expense categorization, insights, chatbot |
| Rule-based NLP | Fallback categorization |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

FinanceTracker/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Budget.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── expenses.js
│   │   ├── budget.js
│   │   ├── ai.js
│   │   ├── insights.js
│   │   └── chatbot.js
│   │
│   ├── services/
│   │   ├── aiCategorizer.js
│   │   ├── insightsService.js
│   │   └── chatbotService.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   └── PrivateRoute.js
│   │   │   │
│   │   │   └── Navbar.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Expenses.js
│   │   │   ├── Budget.js
│   │   │   └── History.js
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── pdfReport.js
│   │   │
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── LICENSE
└── README.md
---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/NikithaDineshKumar/FinanceTracker.git
cd FinanceTracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financetracker
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm start
```

### 4. Open the app
Go to [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Expense Routes (Protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add new expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/expenses/summary` | Get monthly summary |

### Budget Routes (Protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/budget` | Get monthly budget |
| POST | `/api/budget` | Set/update budget |
| GET | `/api/budget/all` | Get all budgets |

### AI Routes (Protected)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/categorize` | AI expense categorization |
| GET | `/api/insights` | Get AI spending insights |
| POST | `/api/chatbot` | Chat with budget advisor |

---

## 📊 Expense Categories

**Needs:** Food • Grocery • Vegetables • Medicine • Hospital • Milk • Current • Tuition

**Wants:** Shopping • Transport • Cosmetics • Dress • Service • Maid • Stationary • Other

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NODE_ENV` | Environment (development/production) |
| `GEMINI_API_KEY` | Google Gemini API key |

---

## 🗺️ Roadmap

- [x] User authentication (JWT)
- [x] Expense CRUD operations
- [x] Budget management
- [x] Visual charts and dashboard
- [x] Monthly history
- [x] Responsive design with hamburger menu
- [x] AI expense categorizer (Google Gemini 2.5 Flash)
- [x] Rule-based fallback categorizer
- [x] Smart spending insights
- [x] RAG budget advisor chatbot
- [x] PDF report export
- [x] Deploy to Vercel + Render + MongoDB Atlas

---

## 🤝 Contributing

This is a personal project but feel free to fork and build on it!

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Nikitha Dinesh Kumar**  
- GitHub: [@NikithaDineshKumar](https://github.com/NikithaDineshKumar)

---

> ⭐ If you found this project helpful, please give it a star!