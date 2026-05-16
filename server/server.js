const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.post('/api/log', (req, res) => {
  console.log('FRONTEND ERROR:', req.body);
  res.status(200).send();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const path = require('path');
// Serve static assets in production
// Production catch-all: Serve index.html for any non-API routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

// Hardened start sequence for Railway
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Sync database after binding to port to satisfy health checks
  sequelize.sync()
    .then(() => {
      console.log('✅ SQLite Database Synced');
    })
    .catch((err) => {
      console.error('❌ Database Sync Error:', err);
    });
});

// Fallback for JWT_SECRET to prevent startup crash
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'taskpilot_secret_key_fallback_123';
  console.warn('⚠️ WARNING: JWT_SECRET not found. Using fallback key.');
}
