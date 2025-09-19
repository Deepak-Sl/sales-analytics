const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite DB connection
const db = new sqlite3.Database("./sales.db", (err) => {
  if (err) console.error("❌ DB connection error:", err.message);
  else console.log("✅ SQLite DB connected");
});

// Create sales table if not exists
db.run(`CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product TEXT NOT NULL,
  amount INTEGER NOT NULL,
  date TEXT NOT NULL,
  region TEXT NOT NULL
)`);

// GET all sales (optional date filter)
app.get("/api/sales", (req, res) => {
  const { startDate, endDate } = req.query;
  let query = "SELECT * FROM sales";
  const params = [];
  if (startDate && endDate) {
    query += " WHERE date BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST add new sale
app.post("/api/sales", (req, res) => {
  const { product, amount, date, region } = req.body;
  db.run(
    "INSERT INTO sales (product, amount, date, region) VALUES (?, ?, ?, ?)",
    [product, amount, date, region],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, product, amount, date, region });
    }
  );
});

// Test route
app.get("/", (req, res) => res.send("SQL backend running!"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));