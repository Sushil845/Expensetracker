const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection (YOUR FINAL STRING)
mongoose.connect('mongodb+srv://sushilkumarsahoo2020_db_user:lXNcjj2zSCEUpfIZ@cluster7.evx5mhp.mongodb.net/expenseDB?appName=Cluster7')
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Error:", err));

// ✅ Schema
const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true }, // income / expense
  date: { type: Date, default: Date.now } // extra feature 🔥
});

// ✅ Model
const Transaction = mongoose.model('Transaction', TransactionSchema);

// ================= ROUTES =================

// 🔹 Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const data = await Transaction.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Add transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { title, amount, type } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({ error: "All fields required" });
    }

    const newData = new Transaction({ title, amount, type });
    await newData.save();

    res.json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});