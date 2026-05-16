const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'taskpilot_secret_key_fallback_123';

// MOCK DATA (Matches the seed script)
const mockUsers = [
  { id: 1, name: 'Ansh Mahendru', email: 'ansh@taskpilot.com', password: '123456', role: 'Admin' },
  { id: 2, name: 'John Member', email: 'john@taskpilot.com', password: '123456', role: 'Member' },
];

const mockProjects = [
  { id: 1, title: 'TaskSync Platform', description: 'Next-gen enterprise collaboration suite.', createdBy: 1, members: [1, 2] },
  { id: 2, title: 'Mobile App Redesign', description: 'Reimagining the mobile experience.', createdBy: 1, members: [1] },
];

const mockTasks = [
  { id: 1, title: 'Implement JWT Auth', status: 'DONE', priority: 'High', assignedTo: 2, projectId: 1 },
  { id: 2, title: 'Real-time WebSockets', status: 'IN_PROGRESS', priority: 'High', assignedTo: 1, projectId: 1 },
  { id: 3, title: 'Database Optimization', status: 'TODO', priority: 'Medium', assignedTo: 1, projectId: 1 },
];

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ _id: user.id, name: user.name, email: user.email, role: user.role, token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.get('/api/auth/users', (req, res) => res.json(mockUsers));

// PROJECT ROUTES
app.get('/api/projects', (req, res) => res.json(mockProjects));
app.post('/api/projects', (req, res) => {
  const newProject = { ...req.body, id: mockProjects.length + 1 };
  mockProjects.push(newProject);
  res.status(201).json(newProject);
});

// TASK ROUTES
app.get('/api/tasks', (req, res) => {
  const { projectId } = req.query;
  if (projectId) {
    return res.json(mockTasks.filter(t => t.projectId == projectId));
  }
  res.json(mockTasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = { ...req.body, id: mockTasks.length + 1 };
  mockTasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const index = mockTasks.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    mockTasks[index] = { ...mockTasks[index], ...req.body };
    res.json(mockTasks[index]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// HEALTH
app.get('/api/health', (req, res) => res.json({ status: 'ok', environment: 'Vercel Mock' }));

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('SERVERLESS ERROR:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
