const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Add new sale
app.post("/api/sales", async (req, res) => {
  const { product_name, price, sale_date, region } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO sales (product_name, price, sale_date, region)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_name, price, sale_date, region]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all sales
app.get("/api/sales", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sales ORDER BY sale_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));