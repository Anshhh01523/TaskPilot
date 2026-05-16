const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'taskpilot_secret_key_fallback_123';

// MOCK DATA
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@taskpilot.com', password: '123456', role: 'Admin', createdAt: new Date().toISOString() },
  { id: 2, name: 'Tasker Member', email: 'tasker@taskpilot.com', password: '123456', role: 'Member', createdAt: new Date().toISOString() },
  { id: 3, name: 'Sarah Designer', email: 'sarah@taskpilot.com', password: '123456', role: 'Member', createdAt: new Date().toISOString() },
  { id: 4, name: 'Mike Engineer', email: 'mike@taskpilot.com', password: '123456', role: 'Member', createdAt: new Date().toISOString() }
];

const mockProjects = [
  { id: 1, title: 'TaskSync Platform', description: 'Next-gen enterprise collaboration suite.', createdBy: 1, members: [1, 2, 3, 4] },
  { id: 2, title: 'Mobile App Redesign', description: 'Reimagining the mobile experience.', createdBy: 1, members: [1, 3] },
  { id: 3, title: 'Marketing Q3 Campaign', description: 'Launch strategy and assets for Q3.', createdBy: 1, members: [2, 4] },
  { id: 4, title: 'Infrastructure Migration', description: 'Moving from AWS to Vercel and Supabase.', createdBy: 1, members: [1, 2, 4] }
];

const mockTasks = [
  { id: 1, title: 'Implement JWT Auth', status: 'DONE', priority: 'High', assignedTo: 2, projectId: 1, dueDate: '2026-05-20', comments: '[{"text":"Looks good!","author":{"name":"Ansh Mahendru"}}]' },
  { id: 2, title: 'Real-time WebSockets', status: 'IN_PROGRESS', priority: 'High', assignedTo: 1, projectId: 1, dueDate: '2026-05-25' },
  { id: 3, title: 'Database Optimization', status: 'TODO', priority: 'Medium', assignedTo: 4, projectId: 1 },
  { id: 4, title: 'Create Figma Mockups', status: 'DONE', priority: 'High', assignedTo: 3, projectId: 2 },
  { id: 5, title: 'Develop iOS Components', status: 'IN_PROGRESS', priority: 'Medium', assignedTo: 2, projectId: 2 },
  { id: 6, title: 'Write Ad Copy', status: 'TODO', priority: 'Low', assignedTo: 2, projectId: 3 }
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

app.get('/api/auth/users', (req, res) => {
  res.json(mockUsers.map(u => ({ ...u, _id: u.id })));
});

app.post('/api/auth/users', (req, res) => {
  const { name, email, password, role } = req.body;
  if (mockUsers.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = { id: mockUsers.length + 1, name, email, password, role, createdAt: new Date().toISOString() };
  mockUsers.push(newUser);
  res.status(201).json({ ...newUser, _id: newUser.id });
});

app.put('/api/auth/profile', (req, res) => {
  const { name, email, avatar } = req.body;
  // In a real app we'd get user from JWT, here we just update Ansh (ID 1) as the default logged in user
  const user = mockUsers.find(u => u.id === 1); 
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;
    res.json({ ...user, _id: user.id });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/api/auth/password', (req, res) => {
  res.json({ message: 'Password updated successfully (Mock)' });
});

app.put('/api/auth/users/:id/role', (req, res) => {
  const user = mockUsers.find(u => u.id == req.params.id);
  if (user) {
    user.role = req.body.role;
    res.json({ ...user, _id: user.id });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/auth/users/:id', (req, res) => {
  const index = mockUsers.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    mockUsers.splice(index, 1);
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// PROJECT ROUTES
const mapProject = p => {
  const projectMembers = (p.members || []).map(mid => mockUsers.find(u => u.id === mid)).filter(Boolean);
  return { ...p, _id: p.id, members: projectMembers };
};

app.get('/api/projects', (req, res) => {
  res.json(mockProjects.map(mapProject));
});

app.post('/api/projects', (req, res) => {
  const newProject = { ...req.body, id: mockProjects.length + 1 };
  mockProjects.push(newProject);
  res.status(201).json(mapProject(newProject));
});

app.delete('/api/projects/:id', (req, res) => {
  const index = mockProjects.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    mockProjects.splice(index, 1);
    res.json({ message: 'Project deleted' });
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// TASK ROUTES
app.get('/api/tasks', (req, res) => {
  const mapTask = t => {
    const assignedUser = mockUsers.find(u => u.id === t.assignedTo);
    return { ...t, _id: t.id, assignedTo: assignedUser ? { ...assignedUser, _id: assignedUser.id } : null };
  };
  const { projectId } = req.query;
  if (projectId) {
    return res.json(mockTasks.filter(t => t.projectId == projectId).map(mapTask));
  }
  res.json(mockTasks.map(mapTask));
});

app.post('/api/tasks', (req, res) => {
  const newTask = { ...req.body, id: mockTasks.length + 1 };
  mockTasks.push(newTask);
  const assignedUser = mockUsers.find(u => u.id === newTask.assignedTo);
  res.status(201).json({ ...newTask, _id: newTask.id, assignedTo: assignedUser ? { ...assignedUser, _id: assignedUser.id } : null });
});

app.put('/api/tasks/:id', (req, res) => {
  const index = mockTasks.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    mockTasks[index] = { ...mockTasks[index], ...req.body };
    const assignedUser = mockUsers.find(u => u.id === mockTasks[index].assignedTo);
    res.json({ ...mockTasks[index], _id: mockTasks[index].id, assignedTo: assignedUser ? { ...assignedUser, _id: assignedUser.id } : null });
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
