require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import Controllers
const employeeController = require('./controllers/employeeController');
const taskController = require('./controllers/taskController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- ROUTES ---

// 1. Employee Routes
app.get('/api/employees', employeeController.getAllEmployees);
app.post('/api/employees', employeeController.createEmployee);

// 2. Task Routes
app.get('/api/tasks', taskController.getTasks);
app.post('/api/tasks', taskController.createTask);
app.put('/api/tasks/:id', taskController.updateTask);
app.delete('/api/tasks/:id', taskController.deleteTask);

// 3. Dashboard Route
app.get('/api/stats', taskController.getStats);

// Health Check
app.get('/', (req, res) => {
  res.send('API is Running 🚀');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});