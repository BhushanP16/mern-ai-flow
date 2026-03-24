# 🚀 MERN AI Flow App

A full-stack MERN application that allows users to input prompts, generate AI-powered responses, visualize the flow using React Flow, and store conversations in MongoDB.

---

## 📌 Live Demo

* 🌐 Frontend: https://mern-ai-flow-bay.vercel.app
* ⚙️ Backend API: https://mern-ai-flow-backend.onrender.com

---

## 🎯 Features

* 🔹 Interactive flow-based UI using React Flow
* 🔹 Input Node for entering prompts
* 🔹 Result Node for displaying AI responses
* 🔹 Integration with OpenRouter AI API
* 🔹 Save prompt & response to MongoDB
* 🔹 Clean and responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Flow
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### AI Integration

* OpenRouter API (Free Models)

---

## 📂 Project Structure

```
mern-ai-flow/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env (not included)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── nodes/
│   │   │   ├── InputNode.jsx
│   │   │   └── ResultNode.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/BhushanP16/mern-ai-flow.git
cd mern-ai-flow
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_api_key
PORT=5000
```

Run backend:

```
node server.js
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoint

### POST `/api/ask-ai`

**Request:**

```
{
  "prompt": "What is the capital of India?"
}
```

**Response:**

```
{
  "response": "New Delhi"
}
```

---

## 💾 Database Schema (MongoDB)

```
{
  prompt: String,
  response: String,
  createdAt: Date
}
```

---

## 🚀 Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* MongoDB Atlas for cloud database

---


## 👨‍💻 Author

**Bhushan Powar**
Full Stack Developer

---

## ⭐ Acknowledgements

* React Flow Documentation
* OpenRouter API
* MongoDB Atlas


