require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./src/db');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.get('/', (req, res) => {
  res.json({
    message: 'To-Do List API is running successfully.',
    endpoints: {
      getAll: 'GET /api/tasks',
      create: 'POST /api/tasks',
      update: 'PUT /api/tasks/:id',
      delete: 'DELETE /api/tasks/:id',
      frontend: 'GET /app'
    }
  });
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/tasks', taskRoutes);

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ message: 'Server error', error: error.message });
});

app.listen(PORT, () => {
  console.log(`Assignment 1 server running on http://localhost:${PORT}`);
});
