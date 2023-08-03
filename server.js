// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Create an instance of Express
const app = express();

// Use the cors middleware to enable CORS
app.use(cors());

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

// MongoDB connection URI (replace 'your_mongodb_uri' with your actual MongoDB URI)
const MONGODB_URI = "mongodb://127.0.0.1:27017/EmployeeDB";

// // Create a Mongoose Schema for Employee
const employeeSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  age: Number,
  name: String,
  position: String,
});

// Create a Mongoose model based on the schema
const Employee = mongoose.model("Employee", employeeSchema, "Employee");

// GET endpoint to fetch all employees
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Error fetching employees" });
  }
});

// POST endpoint to add a new employee
app.post("/api/employees", async (req, res) => {
  try {
    //let id = new mongoose.Types.ObjectId();
    const newEmployee = req.body;
    //newEmployee._id = id;
    await Employee.create(newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: "Error creating employee" });
  }
});

// PUT endpoint to update an existing employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = req.body;
    await Employee.findByIdAndUpdate(id, updatedEmployee);
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: "Error updating employee" });
  }
});

// DELETE endpoint to remove an employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.deleteOne({ _id: id });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting employee" });
  }
});

// Start the server

const port = 3001;
// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
