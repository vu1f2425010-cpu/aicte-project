require('dotenv').config();
const express = require('express');
const connectDB = require('./src/db');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({
    message: 'User Authentication API is running successfully.',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/profile'
    }
  });
});

app.use('/api/auth', authRoutes);

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ message: 'Server error', error: error.message });
});

app.listen(PORT, () => {
  console.log(`Assignment 2 server running on http://localhost:${PORT}`);
});
