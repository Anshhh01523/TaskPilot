import { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, Clock, AlertCircle, ListTodo, 
  FolderKanban, Zap, Activity, Calendar
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 flex flex-col shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-[var(--color-foreground)]">{value}</h3>
  </div>
);

const MemberDashboard = () => {
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();
  const { user } = useAuthStore();

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

  const activities = [
    { id: 1, action: 'Updated status of', target: 'Login Logic', time: '2h ago', icon: Activity, color: 'text-indigo-500' },
    { id: 2, action: 'Added comment to', target: 'Project Alpha', time: '4h ago', icon: Activity, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 w-full px-4 sm:px-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight flex items-center gap-2">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Member'}! <span className="text-2xl">🚀</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Here's your personal productivity overview.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} colorClass="bg-indigo-50 text-indigo-600" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} colorClass="bg-amber-50 text-amber-500" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} colorClass="bg-red-50 text-red-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
          <h2 className="text-base font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-2">
            <FolderKanban size={18} className="text-emerald-500" /> Assigned Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map(project => (
              <Link to={`/projects/${project._id}`} key={project._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                  <FolderKanban size={14} />
                </div>
                <span className="text-sm font-bold truncate">{project.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
          <h2 className="text-base font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-2">
            <Zap size={18} className="text-indigo-500" /> Task Progress
          </h2>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Overall Completion</span>
              <span className="text-xs font-bold text-indigo-600">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
        <h2 className="text-base font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-2">
          <Clock size={18} className="text-amber-500" /> Upcoming Deadlines
        </h2>
        <div className="space-y-4">
          {upcomingDeadlines.map(task => (
            <div key={task._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent hover:border-amber-100 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{task.title}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>{task.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
