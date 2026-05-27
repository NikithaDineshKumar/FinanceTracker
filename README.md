# FinanceTracker
# 💰 Finance Tracker

A full-stack personal finance tracking application built with the MERN stack. Track your daily expenses, set monthly budgets, visualize spending patterns, and get AI-powered financial insights.

![Finance Tracker](https://img.shields.io/badge/MERN-Stack-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-In%20Development-orange)

---

## 🚀 Live Demo
> Coming soon after deployment

---

## 📸 Screenshots
> Coming soon

---

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** — JWT-based login/signup with bcrypt password hashing
- 💸 **Expense Management** — Add, edit, and delete daily expenses
- 📂 **Smart Categories** — 16 predefined categories + custom category support
- 🏷️ **Needs vs Wants** — Tag every expense to track spending habits
- 📊 **Visual Dashboard** — Day-wise area charts and category pie charts
- 💰 **Budget Management** — Set monthly budgets with health indicators
- 🟢 **Budget Health** — Green/Yellow/Red indicator based on spending
- 📅 **History** — View and analyze expenses from previous months
- 📋 **Monthly Reports** — Detailed category-wise spending summaries

### AI Features (Coming Soon)
- 🤖 **AI Expense Categorizer** — Auto-categorize expenses from natural language
- 💬 **RAG Budget Advisor** — Chat with AI about your spending using your real data
- 📈 **Smart Insights** — LLM-generated personalized financial insights

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
| React Toastify | Notifications |
| React Icons | Icon library |
| CSS3 | Custom responsive styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin requests |
| dotenv | Environment variables |
| Nodemon | Development server |

### AI (Coming Soon)
| Technology | Purpose |
|---|---|
| Groq API | LLM inference |
| Llama 3.1 | Language model |
| RAG Pattern | Context-aware responses |

---

## 📁 Project Structure

```
FinanceTracker/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Expense.js         # Expense schema
│   │   └── Budget.js          # Budget schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── expenses.js        # Expense CRUD routes
│   │   └── budget.js          # Budget routes
│   ├── .env                   # Environment variables (not pushed)
│   ├── .env.example           # Environment variables template
│   └── server.js              # Express server entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Auth/
│       │   │   └── PrivateRoute.js
│       │   └── Navbar.js
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Dashboard.js
│       │   ├── Expenses.js
│       │   ├── Budget.js
│       │   └── History.js
│       ├── utils/
│       │   └── api.js
│       ├── App.js
│       └── App.css
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Git

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

---

## 📊 Expense Categories
```
Food • Transport • Shopping • Grocery • Vegetables
Tuition • Maid • Current • Hospital • Medicine
Milk • Cosmetics • Stationary • Dress • Service • Other
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NODE_ENV` | Environment (development/production) |

---

## 🗺️ Roadmap

- [x] User authentication (JWT)
- [x] Expense CRUD operations
- [x] Budget management
- [x] Visual charts and dashboard
- [x] Monthly history
- [x] Responsive design
- [ ] AI expense categorizer (Groq)
- [ ] RAG budget advisor chatbot
- [ ] Smart spending insights
- [ ] PDF report export
- [ ] Deploy to Vercel + Render

---

## 🤝 Contributing
This is a personal project but feel free to fork and build on it!

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author
**Nikitha Dinesh Kumar**
- GitHub: [@NikithaDineshKumar](https://github.com/NikithaDineshKumar)

---

> ⭐ If you found this project helpful, please give it a star!