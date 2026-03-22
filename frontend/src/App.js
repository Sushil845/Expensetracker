import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  // 🔹 Fetch all transactions
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Add transaction
  const addTransaction = async () => {
    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/transactions", {
        title,
        amount,
        type
      });

      setTitle("");
      setAmount("");
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Calculate totals
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>💰 Expense Tracker</h2>

      <h3>Balance: ₹{balance}</h3>

      {/* Input Section */}
      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button onClick={addTransaction}>Add</button>
      </div>

      {/* List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {transactions.map((t) => (
          <li key={t._id} style={{ margin: "10px 0" }}>
            {t.title} - ₹{t.amount} ({t.type})
            <button
              onClick={() => deleteTransaction(t._id)}
              style={{ marginLeft: "10px" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
