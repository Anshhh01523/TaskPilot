import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectBoard from './pages/ProjectBoard';
import Team from './pages/Team';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'Admin') return <Navigate to="/" />;
  return children;
};

const App = () => {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectBoard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="team" element={<ProtectedRoute adminOnly><Team /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute adminOnly><Analytics /></ProtectedRoute>} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
