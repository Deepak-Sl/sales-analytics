const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://sales-analytics-inwg.vercel.app/"
}));
app.use(express.json()); // body-parser

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Sales Schema
const saleSchema = new mongoose.Schema({
  product: String,
  amount: Number,
  date: Date,
  region: String,
});

const Sale = mongoose.model("Sale", saleSchema);

// Routes
app.get("/api/sales", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sales", async (req, res) => {
  try {
    const newSale = new Sale(req.body);
    await newSale.save();
    res.json(newSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running and connected to MongoDB!");
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));