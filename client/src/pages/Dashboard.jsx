import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { 
  CheckCircle2, Clock, AlertCircle, ListTodo, Plus, ArrowUpRight, 
  ArrowDownRight, ArrowRight, FolderKanban, CheckSquare, Info,
  MessageSquare, FileEdit, Flame, Calendar, Activity, Zap, Users,
  LayoutDashboard
} from 'lucide-react';
import MemberDashboard from './MemberDashboard';

const StatCard = ({ title, value, icon: Icon, colorClass, trend, isPositive, info }) => (
  <div className="relative bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 flex flex-col shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon size={24} />
      </div>
      {info && (
        <div className="relative">
          <Info size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors cursor-help" />
          <div className="absolute right-0 bottom-full mb-2 w-48 p-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 text-center pointer-events-none translate-y-1 group-hover:translate-y-0">
            {info}
            <div className="absolute top-full right-1 -mt-1 border-4 border-transparent border-t-black dark:border-t-white"></div>
          </div>
        </div>
      )}
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
    <div className="flex items-end gap-3">
      <h3 className="text-3xl font-bold text-[var(--color-foreground)]">{value}</h3>
      {trend && (
        <span className={`flex items-center text-xs font-semibold mb-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {trend}% from last week
        </span>
      )}
      {trend === null && (
        <span className="flex items-center text-xs font-semibold mb-1 text-slate-400">
          <ArrowRight size={14} className="mr-0.5" /> Same as last week
        </span>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const { tasks, fetchTasks, createTask, loading: tasksLoading } = useTaskStore();
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
  const { user, users, fetchAllUsers } = useAuthStore();
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activityFilter, setActivityFilter] = useState('All');
  
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'Medium',
    dueDate: ''
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskData.title || !newTaskData.projectId) return;
    
    const success = await createTask(newTaskData);
    if (success) {
      setShowNewTaskModal(false);
      setNewTaskData({ title: '', description: '', projectId: '', priority: 'Medium', dueDate: '' });
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchAllUsers();
  }, [fetchTasks, fetchProjects, fetchAllUsers]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'DONE').length;
    const pending = tasks.filter(t => t.status === 'TODO').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const overdue = tasks.filter(t => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < new Date()).length;

    return { total, completed, pending, inProgress, overdue };
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
  }, [tasks]);

  const recentProjects = useMemo(() => {
    return [...projects].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
  }, [projects]);

  // Derive Activity from Real Data
  const activities = useMemo(() => {
    const list = [];
    tasks.forEach(task => {
      // Assignment/Creation
      list.push({
        id: `create-${task.id}`,
        user: task.assignedTo?.name || 'System',
        action: 'was assigned to',
        target: task.title,
        type: 'create',
        time: new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: 'text-slate-500',
        bg: 'bg-slate-100',
        avatarColor: 'from-slate-400 to-slate-500',
        timestamp: new Date(task.createdAt).getTime()
      });

      // Status Changes
      if (task.status === 'DONE') {
        list.push({
          id: `complete-${task.id}`,
          user: task.assignedTo?.name || 'Team',
          action: 'completed',
          target: task.title,
          type: 'complete',
          time: 'Recently',
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
          avatarColor: 'from-emerald-400 to-teal-500',
          timestamp: new Date(task.updatedAt || task.createdAt).getTime() + 1000 // slightly after creation
        });
      } else if (task.status === 'IN_PROGRESS') {
        list.push({
          id: `status-${task.id}`,
          user: task.assignedTo?.name || 'Team',
          action: 'moved',
          target: `${task.title} to In Progress`,
          type: 'status',
          time: 'Recently',
          color: 'text-amber-500',
          bg: 'bg-amber-50',
          avatarColor: 'from-amber-400 to-orange-500',
          timestamp: new Date(task.updatedAt || task.createdAt).getTime() + 500
        });
      }
    });

    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [tasks]);

  const filteredActivities = activities.filter(activity => {
    if (activityFilter === 'All') return true;
    if (activityFilter === 'Complete') return activity.type === 'complete';
    if (activityFilter === 'In Progress') return activity.type === 'status';
    return true;
  });

  const onlineMembers = useMemo(() => {
    return users.slice(0, 6).map(u => ({
      id: u.id,
      name: u.name,
      initial: u.name.charAt(0),
      color: ['from-indigo-400 to-indigo-600', 'from-emerald-400 to-emerald-600', 'from-purple-400 to-purple-600'][Math.floor(Math.random() * 3)]
    }));
  }, [users]);

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user?.role === 'Member') {
    return <MemberDashboard />;
  }

  return (
    <div className="space-y-8 w-full px-4 sm:px-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight flex items-center gap-2">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Admin'}! <span className="text-2xl">🚀</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Here's what's happening with your team today.</p>
        </div>
        <button 
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm shadow-indigo-200 w-fit"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Team Tasks" value={stats.total} icon={ListTodo} colorClass="bg-indigo-50 text-indigo-600" trend={12} isPositive={true} info="Total active tasks across the entire organization." />
        <StatCard title="Team Completed" value={stats.completed} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" trend={20} isPositive={true} info="Tasks successfully finished by all team members." />
        <StatCard title="Active Projects" value={projects.length} icon={FolderKanban} colorClass="bg-purple-50 text-purple-600" trend={null} info="Total number of ongoing projects in the system." />
        <StatCard title="Total Overdue" value={stats.overdue} icon={AlertCircle} colorClass="bg-red-50 text-red-500" trend={2} isPositive={false} info="Unfinished tasks that have passed their deadline." />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Activity Feed */}
        <div className="xl:col-span-2 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-base font-bold text-[var(--color-foreground)] flex items-center gap-2">
              <Activity size={18} className="text-indigo-500" /> Team Activity
            </h2>
            <div className="relative">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 dark:bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2"
              >
                Filter: {activityFilter}
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                  {['All', 'Complete', 'In Progress'].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActivityFilter(f);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${activityFilter === f ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="relative flex-1 overflow-y-auto">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-5 bottom-5 w-[2px] bg-slate-100 dark:bg-slate-700"></div>
            
            <div className="space-y-6">
              {filteredActivities.length > 0 ? filteredActivities.map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-4 group">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-tr ${activity.avatarColor} border-4 border-[var(--color-card)] shadow-sm flex items-center justify-center text-white text-sm font-bold z-10`}>
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1 pt-1 min-w-0">
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className="font-bold text-[var(--color-foreground)]">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-bold text-[var(--color-foreground)]">{activity.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{activity.time}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <div className={`flex items-center gap-1 ${activity.color} ${activity.bg} dark:bg-opacity-10 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter`}>
                        {activity.type === 'complete' && <CheckCircle2 size={10} />}
                        {activity.type === 'status' && <Zap size={10} />}
                        {activity.type === 'create' && <Plus size={10} />}
                        {activity.type}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 text-sm italic py-4">No recent activity detected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Widgets */}
        <div className="space-y-6">
          
          {/* Deadlines Widget */}
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-[var(--color-foreground)] flex items-center gap-2">
                <Clock size={18} className="text-amber-500" /> Deadlines
              </h2>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[9px] font-black uppercase">Upcoming</span>
            </div>
            <div className="space-y-6">
              {upcomingDeadlines.slice(0, 1).map(task => (
                <div key={task.id} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{task.title}</span>
                    <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">High</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{new Date(task.dueDate).toLocaleDateString()}</p>
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[65%]"></div>
                  </div>
                </div>
              ))}
              {upcomingDeadlines.length === 0 && <p className="text-slate-400 text-xs italic">No urgent deadlines.</p>}
            </div>
          </div>

          {/* Team Online Widget */}
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-2">
              <Users size={18} className="text-emerald-500" /> Team Online
            </h2>
            <div className="flex flex-wrap gap-2">
              {onlineMembers.map(member => (
                <div key={member.id} className="relative group/member">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${member.color} flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-800 shadow-sm cursor-pointer`}>
                    {member.initial}
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 invisible group-hover/member:opacity-100 group-hover/member:visible transition-all whitespace-nowrap z-40">
                    {member.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Momentum Card */}
          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-500 shadow-sm border border-slate-100 dark:border-slate-700">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Great momentum!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your team has completed <span className="font-bold text-indigo-600 dark:text-indigo-400">{stats.completed} tasks</span> this week. You are on track to hit your sprint goals.
                </p>
              </div>
            </div>
          </div>

          {/* Projects Overview - Moved here to fill blank space */}
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base font-bold text-[var(--color-foreground)]">Projects Overview</h2>
              <Link to="/projects" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">View All</Link>
            </div>
            <div className="space-y-10 py-2">
              {recentProjects.map((project, idx) => {
                const colors = [
                  { text: 'text-indigo-600', bg: 'bg-indigo-50', bar: 'bg-indigo-600' },
                  { text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-600' },
                  { text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-600' },
                ];
                const color = colors[idx % 3];
                const progress = [75, 60, 40][idx] || 50;
                
                return (
                  <div key={project.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${color.bg} dark:bg-opacity-10 flex items-center justify-center ${color.text}`}>
                          <FolderKanban size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{project.title}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${color.bar} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {recentProjects.length === 0 && <p className="text-slate-400 text-center py-6 text-sm italic">No active projects.</p>}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Recent Tasks - Expanded to fill width */}
      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-base font-bold text-[var(--color-foreground)] flex items-center gap-2">
            <CheckSquare size={18} className="text-indigo-500" /> Recent Tasks
          </h2>
          <Link to="/tasks" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between group p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Updated 2h ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'DONE' ? 'bg-emerald-500' : 
                  task.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-slate-300'
                }`}></div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
          {recentTasks.length === 0 && <p className="text-slate-400 text-center py-6 text-sm italic col-span-2">No recent tasks.</p>}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Task Title *</label>
                <input type="text" required value={newTaskData.title} onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" placeholder="What needs to be done?" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project *</label>
                <select required value={newTaskData.projectId} onChange={(e) => setNewTaskData({...newTaskData, projectId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm">
                  <option value="" disabled>Select a project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                  <select value={newTaskData.priority} onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                  <input type="date" value={newTaskData.dueDate} onChange={(e) => setNewTaskData({...newTaskData, dueDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setShowNewTaskModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-bold transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] font-bold shadow-sm shadow-indigo-200 transition-colors">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
