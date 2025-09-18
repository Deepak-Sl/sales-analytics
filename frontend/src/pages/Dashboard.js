import React, { useState, useEffect } from "react";
import axios from "axios";
import SummaryCard from "../components/SummaryCard";
import "./Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({
    product: "",
    amount: "",
    date: "",
    region: ""
  });

  // Fetch sales from backend
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setNewSale({ ...newSale, [e.target.name]: e.target.value });
  };

  // Add new sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/sales", {
        ...newSale,
        amount: Number(newSale.amount)
      });
      setSales([...sales, res.data]);
      setNewSale({ product: "", amount: "", date: "", region: "" });
    } catch (err) {
      console.error("Error adding sale:", err);
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalOrders = sales.length;

  const chartData = sales
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(sale => ({ date: new Date(sale.date).toLocaleDateString(), amount: sale.amount }));

  return (
    <div className="dashboard-container">
      <h1>Sales Dashboard</h1>

      {/* Summary Cards */}
      <div className="summary-cards-container">
        <SummaryCard title="Total Sales" value={`$${totalSales}`} />
        <SummaryCard title="Total Orders" value={totalOrders} />
      </div>

      {/* Add New Sale Form */}
      <div className="new-sale-form">
        <h2>Add New Sale</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="product"
            placeholder="Product"
            value={newSale.product}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newSale.amount}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={newSale.date}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="region"
            placeholder="Region"
            value={newSale.region}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Sale</button>
        </form>
      </div>

      {/* Line Chart */}
      <h2>Sales Over Time</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sales Table */}
      <div className="sales-table-container">
        <h2>All Sales</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td>{sale.product}</td>
                <td>{sale.amount}</td>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>{sale.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;