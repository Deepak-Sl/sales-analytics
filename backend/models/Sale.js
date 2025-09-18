const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  region: { type: String }
});

module.exports = mongoose.model("Sale", saleSchema);