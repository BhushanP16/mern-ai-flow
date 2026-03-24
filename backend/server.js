const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Connect to MongoDB ----
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ---- Create MongoDB Schema (define data structure) ----
const conversationSchema = new mongoose.Schema({
  prompt: String,       // What the user asked
  response: String,     // What the AI answered
  createdAt: {
    type: Date,
    default: Date.now,  // Time will be saved automatically
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

// Add at the start of server.js - for testing
app.get("/api/test-models", async (req, res) => {
  try {
    const response = await axios.get(
      "https://openrouter.ai/api/v1/models",
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    // Filter only free models
    const freeModels = response.data.data
      .filter((m) => m.id.includes(":free"))
      .map((m) => m.id);

    console.log("✅ Free Models:", freeModels);
    res.json({ freeModels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- ROUTE 1: Send prompt to AI ----
// Frontend will send a POST request here
app.post("/api/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt not provided!" });
    }

    console.log("📩 Prompt received:", prompt);

    // ✅ FIX: Updated model ID and headers
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-3-super-120b-a12b:free", // ✅ free model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // ✅ Add this
          "X-Title": "MERN AI Flow App",           // ✅ Add this
        },
      }
    );

    const aiAnswer = response.data.choices[0].message.content;
    console.log("🤖 AI Answer:", aiAnswer);

    res.json({ answer: aiAnswer });

  } catch (error) {
    // ✅ Better error logging
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("❌ Status:", error.response.status);
      console.error("❌ Data:", JSON.stringify(error.response.data));
    }
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// ---- ROUTE 2: Save Data to MongoDB ----
app.post("/api/save", async (req, res) => {
  try {
    const { prompt, response } = req.body;

    const newData = new Conversation({
      prompt,
      response,
    });

    await newData.save();

    res.status(200).json({ message: "Saved successfully" });
  } catch (error) {
    console.error("❌ Save Error:", error);
    res.status(500).json({ error: "Failed to save" });
  }
});

// ---- ROUTE 3: Get all saved conversations ----
app.get("/api/conversations", async (req, res) => {
  try {
    const all = await Conversation.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data!" });
  }
});

// ---- Start the Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running: http://localhost:${PORT}`);
});
